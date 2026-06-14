from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Notification

# Cache pre-save state for placement change detection
_placement_prev = {}


def _notify(recipient, title, message, notification_type, object_id=None, content_type=None):
    if recipient is None:
        return
    Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        notification_type=notification_type,
        object_id=object_id,
        content_type=content_type,
    )


# ── Logbook signals ──────────────────────────────────────────────────────────

@receiver(post_save, sender="logbook.Logbook")
def on_logbook_save(sender, instance, created, **kwargs):
    if instance.status != "pending":
        return
    placement = instance.placement
    student_name = instance.student.get_full_name() or instance.student.username
    title = f"New logbook submission — Week {instance.week_number}"
    message = f"{student_name} submitted their Week {instance.week_number} logbook for review."

    if placement.supervisor:
        _notify(
            placement.supervisor, title, message, "logbook_submitted",
            object_id=instance.pk, content_type="logbook",
        )
    if placement.academic_supervisor:
        _notify(
            placement.academic_supervisor, title, message, "logbook_submitted",
            object_id=instance.pk, content_type="logbook",
        )


# ── LogReview signals ─────────────────────────────────────────────────────────

@receiver(post_save, sender="reviews.LogReview")
def on_log_review_save(sender, instance, created, **kwargs):
    if not created:
        return

    logbook = instance.Logbook
    student = logbook.student
    reviewer_name = instance.reviewer.get_full_name() or instance.reviewer.username

    action_labels = {
        "approved": (
            "Logbook approved",
            f"Your Week {logbook.week_number} logbook was approved by {reviewer_name}.",
        ),
        "revision_requested": (
            "Revision requested",
            f"{reviewer_name} requested revisions on your Week {logbook.week_number} logbook.",
        ),
        "rejected": (
            "Logbook rejected",
            f"Your Week {logbook.week_number} logbook was rejected by {reviewer_name}.",
        ),
    }

    title, message = action_labels.get(
        instance.action,
        ("Logbook reviewed", f"Your Week {logbook.week_number} logbook was reviewed by {reviewer_name}."),
    )

    _notify(
        student, title, message, "logbook_reviewed",
        object_id=logbook.pk, content_type="logbook",
    )


# ── Evaluation signals ────────────────────────────────────────────────────────

@receiver(post_save, sender="evaluation.Evaluation")
def on_evaluation_save(sender, instance, created, **kwargs):
    if not instance.is_finalised:
        return

    student = instance.placement.student
    evaluator_name = instance.evalutor.get_full_name() or instance.evalutor.username
    criteria_name = instance.criteria.name if instance.criteria else "a criterion"

    _notify(
        student,
        "Evaluation submitted",
        f"Your evaluation for {criteria_name} has been finalised by {evaluator_name}.",
        "evaluation_finalised",
        object_id=instance.pk,
        content_type="evaluation",
    )


# ── InternshipPlacement signals ───────────────────────────────────────────────

@receiver(pre_save, sender="placements.InternshipPlacement")
def on_placement_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            prev = sender.objects.get(pk=instance.pk)
            _placement_prev[instance.pk] = {
                "status": prev.status,
                "supervisor_id": prev.supervisor_id,
                "academic_supervisor_id": prev.academic_supervisor_id,
            }
        except sender.DoesNotExist:
            pass


@receiver(post_save, sender="placements.InternshipPlacement")
def on_placement_save(sender, instance, created, **kwargs):
    if created:
        # Notify all admins of new placement request
        from django.contrib.auth import get_user_model
        User = get_user_model()
        admins = User.objects.filter(role="internship_admin")
        student_name = (
            instance.student.get_full_name() or instance.student.username
            if instance.student else "A student"
        )
        for admin in admins:
            _notify(
                admin,
                "New placement request",
                f"{student_name} submitted a placement request at {instance.company_name or 'an organisation'}.",
                "placement_created",
                object_id=instance.pk,
                content_type="placement",
            )
        return

    prev = _placement_prev.pop(instance.pk, {})

    # Status changed → notify student
    if instance.student and instance.status != prev.get("status") and instance.status in ("approved", "rejected"):
        _notify(
            instance.student,
            f"Placement {instance.status}",
            f"Your placement at {instance.company_name or 'the organisation'} has been {instance.status}.",
            "placement_status_changed",
            object_id=instance.pk,
            content_type="placement",
        )

    # Workplace supervisor newly assigned
    if instance.supervisor and instance.supervisor_id != prev.get("supervisor_id"):
        student_name = (
            instance.student.get_full_name() or instance.student.username
            if instance.student else "a student"
        )
        _notify(
            instance.supervisor,
            "You have been assigned as workplace supervisor",
            f"You have been assigned to supervise {student_name} at {instance.company_name or 'an organisation'}.",
            "placement_supervisor_assigned",
            object_id=instance.pk,
            content_type="placement",
        )

    # Academic supervisor newly assigned
    if instance.academic_supervisor and instance.academic_supervisor_id != prev.get("academic_supervisor_id"):
        student_name = (
            instance.student.get_full_name() or instance.student.username
            if instance.student else "a student"
        )
        _notify(
            instance.academic_supervisor,
            "You have been assigned as academic supervisor",
            f"You have been assigned as academic supervisor for {student_name} at {instance.company_name or 'an organisation'}.",
            "placement_supervisor_assigned",
            object_id=instance.pk,
            content_type="placement",
        )
