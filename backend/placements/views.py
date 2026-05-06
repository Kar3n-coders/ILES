from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from users.permissions import IsAdmin

from .models import InternshipPlacement
from .serializers import PlacementCreateSerializer, PlacementSerializer


class PlacementViewSet(viewsets.ModelViewSet):
    """
    CRUD for InternshipPlacement.
    Access rules:
      - Admin: full CRUD
      - Supervisor: read-only (their supervised placements)
      - Student: read-only + can POST own placement request (status=pending)
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PlacementCreateSerializer
        return PlacementSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "internship_admin":
            return (
                InternshipPlacement.objects.all()
                .select_related("student", "supervisor")
                .prefetch_related("Weekly_logs")
            )

        elif user.role in ["workplace_supervisor", "academic_supervisor"]:
            return (
                InternshipPlacement.objects.filter(supervisor=user)
                .select_related("student", "supervisor")
                .prefetch_related("Weekly_logs")
            )

        elif user.role == "student":
            return (
                InternshipPlacement.objects.filter(student=user)
                .select_related("supervisor")
                .prefetch_related("Weekly_logs")
            )

        return InternshipPlacement.objects.none()

    def create(self, request, *args, **kwargs):
        """
        students submit their own placement request (status=pending).
        """
        if request.user.role not in ["student", "internship_admin"]:
            return Response(
                {"error": "Only students or administrators can create placements."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Auto-assign student to the requesting user if they are a student
        if request.user.role == "student":
            serializer.save(student=request.user, status="pending")
        else:
            serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def update(self, request, *args, **kwargs):
        if request.user.role != "internship_admin":
            return Response(
                {"error": "Only administrators can update placements."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "internship_admin":
            return Response(
                {"error": "Only administrators can delete placements."},
                status=status.HTTP_403_FORBIDDEN,
            )
        placement = self.get_object()
        logbook_count = placement.Weekly_logs.count()
        if logbook_count > 0:
            return Response(
                {
                    "error": f"Cannot delete placement with {logbook_count} logbook entries. Archive it instead."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)
