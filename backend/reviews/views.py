from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from users.permissions import IsSupervisor

from .models import LogReview
from .serializers import LogReviewCreateSerializer, LogReviewSerializer


class LogReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return LogReviewCreateSerializer
        return LogReviewSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "internship_admin":
            return LogReview.objects.all().select_related(
                "Logbook", "reviewer", "Logbook__student"
            )

        elif user.role in ["workplace_supervisor", "academic_supervisor"]:
            return LogReview.objects.filter(reviewer=user).select_related(
                "Logbook", "reviewer", "Logbook__student"
            )

        elif user.role == "student":
            return LogReview.objects.filter(Logbook__student=user).select_related(
                "Logbook", "reviewer"
            )

        return LogReview.objects.none()

    def create(self, request, *args, **kwargs):
        if request.user.role not in [
            "workplace_supervisor",
            "academic_supervisor",
            "internship_admin",
        ]:
            return Response(
                {"error": "Only supervisors can submit logbook reviews."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

    def update(self, request, *args, **kwargs):
        return Response(
            {
                "error": "Reviews cannot be edited after submission. Submit a new review if needed."
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "internship_admin":
            return Response(
                {"error": "Only administrators can delete reviews."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)
