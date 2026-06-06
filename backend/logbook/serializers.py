from rest_framework import serializers

from .models import Logbook


class LogbookSerializer(serializers.ModelSerializer):
    """
    Main Serializer for reading logbook data
    """

    # Follow the FK to get the student username
    student_username = serializers.CharField(source="student.username", read_only=True)
    student_fullname = serializers.SerializerMethodField()

    # Status Label
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    # Placement company name
    company_name = serializers.CharField(
        source="placement.company_name", read_only=True
    )

    class Meta:
        model = Logbook
        fields = [
            "id",
            "week_number",
            "start_date",
            "end_date",
            "activities",
            "status",
            "status_display",
            "student",  # FK id
            "student_username",  # computed - used when reading
            "student_fullname",  # computed - used when reading
            "placement",  # FK id
            "company_name",  # computed - used when reading
            "submitted_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "created_at",
            "updated_at",
            "submitted_at",
            "student",  # set automatically by the viewset
        ]

    def get_student_fullname(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}".strip()


class LogbookCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating logbook entries (POST)
    """

    class Meta:
        model = Logbook
        fields = ["week_number", "start_date", "end_date", "activities", "placement"]

    def validate_week_number(self, value):
        if value < 1 or value > 52:
            raise serializers.ValidationError("Week number must be between 1 and 52")
        return value

    def validate(self, data):
        # Ensures the dates are in correct order
        if data["start_date"] and data["end_date"]:
            if data["start_date"] >= data["end_date"]:
                raise serializers.ValidationError(
                    {"end_date": "End date must be after start date"}
                )

        # prevent duplicate week submissions for the same placement
        # We access the request via self.context to get the user's current logbook entries
        request = self.context["request"]
        if request and request.user:
            existing_logbook = Logbook.objects.filter(
                student=request.user,
                week_number=data["week_number"],
                placement=data["placement"],
            )

            if self.instance:
                existing_logbook = existing_logbook.exclude(pk=self.instance.pk)
            if existing_logbook.exists():
                raise serializers.ValidationError(
                    {
                        "week_number": "You already have a logbook entry for this week on this placement"
                    }
                )

        return data
