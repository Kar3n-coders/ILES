from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import IsStudent, IsSupervisor

from .models import Logbook
from .serializers import LogbookCreateSerializer, LogbookSerializer


class LogbookViewSet(viewsets.ModelViewSet):
    """Full CRUD ViewSet for Logbook entries"""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        """
        Returns different serializers based on the action.
        This avoids one bloated serializer from doing everything
        'create' -> LogbookCreateSerializer (minimal fields for input)
        Everything else -> LogbookSerializer (full fields)
        """

        if self.action == "create":
            return LogbookCreateSerializer
        return LogbookSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "student":
            # Students see only their own logs
            return (
                Logbook.objects.filter(student=user)
                .select_related("student", "placement")
                .order_by("-created_at")
            )

        elif user.role in ["workplace_supervisor", "academic_supervisor"]:
            # Supervisors see all logs, from placements they supervise
            return (
                Logbook.objects.filter(placement__supervisor=user)
                .select_related("student", "placement")
                .order_by("-created_at")
            )

        elif user.role == "internship_admin":
            # Admins see all logs
            return (
                Logbook.objects.all()
                .select_related("student", "placement")
                .order_by("created_at")
            )

        # Unknown role sees nothing
        return Logbook.objects.none()

    def perform_create(self, serializer):
        #Only students can create logs
        if self.request.user.role != "student":
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only Students can create logbook entries")

        serializer.save(
            student=self.request.user,
            status="draft" #Always set to draft when creating
        )

    def update(self, request, *args, **kwargs):
        logbook = self.get_object()

        #Only the owner student can update
        if logbook.student != request.user and request.user.role != "internship_admin":
            return Response(
                {"error": "You can only update your own logbook entries"},
                status=status.HTTP_403_FORBIDDEN
            )

        #Can only edit drafts
        if logbook.status != "draft":
            return Response(
                {"error": f"Cannot edit a log with status '{logbook.status}'. Only drafts can be edited"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        logbook = self.get_object()

        if logbook.student != request.user:
            return Response(
                {"error": "You can only delete your own logbook entries"},
                status=status.HTTP_403_FORBIDDEN
            )

        if logbook.status != "draft":
            return Response(
                {"error": "Only draft logs can be deleted"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], url_path="submit")
    def submit(self, request, pk=None):
        """
        Custom Action: PATCH /api/logbook/{id}/submit/
        Transitions a log from 'draft' to 'pending
        Only the owning student can call this
        """
        logbook = self.get_object()

        #Verify Ownership
        if logbook.student != request.user:
            return Response(
                {"error": "You can only submit your own logbook entries"},
                status=status.HTTP_403_FORBIDDEN
            )

        #Verify current state
        if logbook.status != "draft":
           return Response(
               {"error":  f"Cannot submit a log with status '{logbook.status}'. Only drafts can be submitted."},
               status=status.HTTP_400_BAD_REQUEST
           )

        #Validate the log content before submitting
        if not logbook.activities or not logbook.activities.strip():
            return Response(
                {"error": "Cannot submit a log with empty activities"},
                status=status.HTTP_400_BAD_REQUEST
            )

        #Perform the state transition
        try:
            logbook.status = "pending"
            logbook.submitted_at = timezone.now()
            logbook.save()
        except Exception as e:
            return Response(
                {"error": f"Failed to submit logbook: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            LogbookSerializer(logbook).data,
            status=status.HTTP_200_OK
        )
