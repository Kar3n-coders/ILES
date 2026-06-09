from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
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

        # Allow filtering by role for placement onboarding dropdowns
        if role_param and user.is_authenticated:
            valid_roles = dict(CustomUser.ROLES)
            if role_param in valid_roles:
                return CustomUser.objects.filter(role=role_param).order_by('username')

        if user.role == 'internship_admin':
            return CustomUser.objects.all().order_by('username')

        if user.role in ['workplace_supervisor', 'academic_supervisor']:
            from placements.models import InternshipPlacement
            student_ids = InternshipPlacement.objects.filter(
                supervisor=user
            ).values_list('student_id', flat=True)
            return CustomUser.objects.filter(id__in=student_ids)

        return CustomUser.objects.filter(id=user.id)