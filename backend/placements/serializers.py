from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import InternshipPlacement

User = get_user_model()


class PlacementSerializer(serializers.ModelSerializer):
    """
    Serializer for reading placement data.
    We expose rich information about the student and supervisor
    rather than just their IDS.
    """

    student_username = serializers.CharField(source="student.username", read_only=True)
    student_full_name = serializers.SerializerMethodField()

    supervisor_username = serializers.CharField(
        source="supervisor.username", read_only=True
    )
    supervisor_full_name = serializers.SerializerMethodField()

    logbook_count = serializers.SerializerMethodField()

    class Meta:
        model = InternshipPlacement
        fields = [
            "id",
            "student",
            "student_username",
            "student_full_name",
            "company_name",
            "start_date",
            "end_date",
            "supervisor",
            "supervisor_username",
            "supervisor_full_name",
            "logbook_count",
        ]

    def get_student_full_name(self, obj):
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}".strip()
        return None

    def get_logbook_count(self, obj):
        """
        Count how many logbook entries exist for this placement.
        The related_name='Weekly_logs' was set in the Logbook model.
        """
        return obj.Weekly_logs.count()


class PlacementCreateSerializer(serializers.ModelSerializer):
    """
    Used by admins when creating a new placement.
    Validates that student and supervisor have the correct roles.
    """

    class Meta:
        model = InternshipPlacement
        fields = [
            "student",
            "company_name",
            "start_date",
            "end_date",
            "supervisor",
        ]

    def validate_student(self, value):
        """Ensure the assigned user is actually a student."""
        if value.role != "student":
            raise serializers.ValidationError(
                f"User '{value.username}' is not a student (role: {value.role})."
            )
        return value

    def validate_supervisor(self, value):
        """Ensure the assigned supervisor has a supervisor role."""
        valid_supervisor_roles = ["workplace_supervisor", "academic_supervisor"]
        if value.role not in valid_supervisor_roles:
            raise serializers.ValidationError(
                f"User '{value.username}' is not a supervisor (role: {value.role})."
            )
        return value

    def validate(self, data):
        """Cross-field: end date must be after start date."""
        if data.get("start_date") and data.get("end_date"):
            if data["start_date"] >= data["end_date"]:
                raise serializers.ValidationError(
                    {"end_date": "End date must be after start date."}
                )
        return data
