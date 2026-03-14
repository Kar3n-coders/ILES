from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLES = [
        ("student", "Student Intern"),
        ("workplace_supervisor", "Workplace Supervisor"),
        ("academic_supervisor", "Academic Supervisor"),
        ("internship_admin", "Internship Administrator")
    ]

    role = models.CharField(choices=ROLES, max_length=30)

    phone_number = models.CharField(max_length=20, blank=True)
    university = models.CharField(max_length=200, blank=True)
    course = models.CharField(max_length=200, blank=True)
    department = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"