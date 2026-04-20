from django.conf import settings
from django.db import models
from placements.models import InternshipPlacement


class EvaluationCriteria(models.Model):
    """
    Defines a scoring category. Examples:
    - Punctuality (weight=0.30)
    - Technical Skills (weight=0.40)
    - Initiative (weight=0.30)

    All weights across all criteria should sum to 1.0 (100%).
    The admin sets these up once; supervisors don't control weights.
    """

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    weight = models.FloatField(
        help_text="Decimal weight, e.g. 0.40 for 40%. All criteria weights must sum to 1.0"
    )

    def __str__(self):
        return f"{self.name} ({self.weight * 100:.0f}%)"

    class Meta:
        verbose_name_plural = "Evaluation Criteria"


class Evaluation(models.Model):
    """
    A single score given by a supervisor for a specific criterion
    on a specific placement.

    Example: Supervisor A scores Student B's 'Punctuality' as 4/5.
    The weighted_score = 4 * 0.30 = 1.20 (for 30% weight).
    """

    EVALUATOR_TYPE_CHOICES = [
        ("workplace", "Workplace Supervisor"),
        ("academic", "Academic Supervisor"),
    ]

    placement = models.ForeignKey(
        InternshipPlacement, on_delete=models.CASCADE, related_name="evaluations"
    )

    evalutor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="evaluations_given",
    )

    evalutor_type = models.CharField(max_length=20, choices=EVALUATOR_TYPE_CHOICES)

    criteria = models.ForeignKey(
        EvaluationCriteria, on_delete=models.CASCADE, related_name="evaluations"
    )

    score = models.FloatField(
        help_text="Score given by supervisor (1-5 scale)", null=True, blank=True
    )

    # Automatically computed from score * criteria.weight
    weighted_score = models.FloatField(
        blank=True,
        null=True,
        help_text="Automatically calculated: score * criteria.weight",
    )

    is_finalised = models.BooleanField(default=False)
    evaluated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("placement", "evalutor", "criteria")

    def save(self, *args, **kwargs):
        """
        Auto-calculate the weighted score before saving.
        Now this works correctly because criteria IS a ForeignKey object.
        """

        self.weighted_score = self.score * self.criteria.weight
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.evalutor.username} → "
            f"{self.criteria.name}: {self.score}/5 "
            f"(weighted: {self.weighted_score:.2f})"
        )
