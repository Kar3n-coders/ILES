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

    academic_supervisor_username = serializers.CharField(
        source="academic_supervisor.username", read_only=True
    )
    academic_supervisor_full_name = serializers.SerializerMethodField()

    status_display = serializers.CharField(source="get_status_display", read_only=True)

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
            "status",
            "status_display",
            "supervisor",
            "supervisor_username",
            "supervisor_full_name",
            "academic_supervisor",
            "academic_supervisor_username",
            "academic_supervisor_full_name",
            "logbook_count",
        ]

    def get_student_full_name(self, obj):
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}".strip()
        return None

    def get_supervisor_full_name(self, obj):
        if obj.supervisor:
            return f"{obj.supervisor.first_name} {obj.supervisor.last_name}".strip()
        return None

    def get_academic_supervisor_full_name(self, obj):
        if obj.academic_supervisor:
            return f"{obj.academic_supervisor.first_name} {obj.academic_supervisor.last_name}".strip()
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
            "academic_supervisor",
        ]

        extra_kwargs = {
            "supervisor": {"required": False, "allow_null": True},
            "academic_supervisor": {"required": False, "allow_null": True},
            "student": {
                "required": False
            },
        }

    def validate_student(self, value):
        """Ensure the assigned user is actually a student."""
        if value.role != "student":
            raise serializers.ValidationError(
                f"User '{value.username}' is not a student (role: {value.role})."
            )
        return value

    def validate_supervisor(self, value):
        if value.role != "workplace_supervisor":
            raise serializers.ValidationError(
                f"User '{value.username}' is not a workplace supervisor (role: {value.role})."
            )
        return value

    def validate_academic_supervisor(self, value):
        if value is not None and value.role != "academic_supervisor":
            raise serializers.ValidationError(
                f"User '{value.username}' is not an academic supervisor (role: {value.role})."
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
