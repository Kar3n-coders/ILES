from django.db import models
from django.conf import settings
from placements.models import InternshipPlacement

class Logbook(models.Model):

    STATUS = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('submitted', 'Submitted'),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
    ]

    week_number = models.PositiveIntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    activities = models.TextField()
    status = models.CharField(max_length=20, 
        choices = STATUS, 
        default = 'draft'
    )
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete = models.CASCADE,
        related_name='Weekly_logs'
    )

    placement = models.ForeignKey(
        InternshipPlacement,
        on_delete=models.CASCADE,
        related_name='Weekly_logs'
    )

    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student','week_number','placement')

    def __str__(self):
        return f"Week {self.week_number} - {self.student.username} [{self.status}]"