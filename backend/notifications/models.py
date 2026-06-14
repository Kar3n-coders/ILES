from django.conf import settings
from django.db import models


class Notification(models.Model):
    TYPES = [
        ("logbook_submitted", "Logbook Submitted"),
        ("logbook_reviewed", "Logbook Reviewed"),
        ("evaluation_finalised", "Evaluation Finalised"),
        ("placement_created", "Placement Created"),
        ("placement_status_changed", "Placement Status Changed"),
        ("placement_supervisor_assigned", "Supervisor Assigned"),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_type = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient.username} — {self.title}"
