from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLES = [
        ("student", "Student Intern"),
        ("workplace_supervisor", "Workplace Supervisor"),
        ("academic_supervisor", "Academic Supervisor"),
        ("internship_admin", "Internship Administrator"),
    ]

    role = models.CharField(choices=ROLES, max_length=30)

    # student_id = models.CharField( unique=True, blank=True, null=True, max_length=20, help_text="25/U/0001")

    phone_number = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, blank=True)
    university = models.CharField(max_length=200, blank=True)
    course = models.CharField(max_length=200, blank=True)
    department = models.CharField(max_length=200, blank=True)

    def __str__(self):
        display = f"{self.username} ({self.get_role_display()})"
        if self.company:
            display += f" @ {self.company}"
        return display
