from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserProfileSerializer, UserRegistrationSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role_param = self.request.query_params.get('role')
        company_param = self.request.query_params.get('company')

        # Role + optional company filter (used by student onboarding dropdowns)
        # ?role=workplace_supervisor&company=Acme Ltd → WS from that company only
        if role_param:
            valid_roles = dict(CustomUser.ROLES)
            if role_param in valid_roles:
                qs = CustomUser.objects.filter(role=role_param).order_by('first_name', 'last_name')
                if company_param:
                    qs = qs.filter(company__iexact=company_param)
                return qs

        if user.role == 'internship_admin':
            from placements.models import InternshipPlacement
            # WS: only from same company
            # Students: only those with approved placements supervised by this company's WS
            ws_ids = CustomUser.objects.filter(
                role='workplace_supervisor',
                company__iexact=user.company
            ).values_list('id', flat=True)
            approved_student_ids = InternshipPlacement.objects.filter(
                supervisor__in=ws_ids,
                status='approved'
            ).values_list('student_id', flat=True)
            return CustomUser.objects.filter(
                id__in=list(ws_ids) + list(approved_student_ids)
            ).order_by('role', 'first_name')

        if user.role == 'workplace_supervisor':
            from placements.models import InternshipPlacement
            student_ids = InternshipPlacement.objects.filter(
                supervisor=user
            ).values_list('student_id', flat=True)
            return CustomUser.objects.filter(id__in=student_ids)

        if user.role == 'academic_supervisor':
            from placements.models import InternshipPlacement
            student_ids = InternshipPlacement.objects.filter(
                academic_supervisor=user
            ).values_list('student_id', flat=True)
            return CustomUser.objects.filter(id__in=student_ids)

        return CustomUser.objects.filter(id=user.id)

    @action(detail=False, methods=['get'], url_path='companies')
    def companies(self, request):
        """Return distinct company names from internship_admin accounts."""
        companies = (
            CustomUser.objects
            .filter(role='internship_admin')
            .exclude(company='')
            .values_list('company', flat=True)
            .distinct()
            .order_by('company')
        )
        return Response(list(companies))
