from logbook.models import Logbook
from rest_framework import serializers

from .models import LogReview


# LogReview Serializer
class LogReviewSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.CharField(
        source="reviewer.username", read_only=True
    )

    review_fullname = serializers.SerializerMethodField()

    logbook_week = serializers.IntegerField(source="Logbook.week", read_only=True)

    student_username = serializers.CharField(
        source="Logbook.student.username", read_only=True
    )

    action_display = serializers.CharField(source="get_action_display", read_only=True)

    class Meta:
        model = LogReview

        fields = [
            "id",
            "Logbook",
            "logbook_week",
            "student_username",
            "reviewer",
            "reviewer_username",
            "review_fullname",
            "action_display",
            "comment",
            "action",
            "reviewed_at",
        ]

        read_only_fields = ["reviewer", "reviewed_at"]

    def get_reviewer_fullname(self, obj):
        return f"{obj.reviewer.first_name} {obj.reviewer.last_name}".strip()


# LogReviewCreate Serializer
class LogReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogReview
        fields = ["Logbook", "action", "comment"]

    def validate_Logbook(self, value):
        if value.status not in ["pending", "reviewed"]:
            raise serializers.ValidationError(
                f"Cannot review a logbook with the status '{value.status}'"
                "Only submitted(pending) or previously reviewed logbooks can be reviewed."
            )
        return value

    def validate(self, data):
        request = self.context["request"]
        logbook = data["Logbook"]

        if request and logbook and request.user:
            supervisor = logbook.placement.supervisor
            if supervisor != request.user and request.user.role != "internship_admin":
                raise serializers.ValidationError(
                    {
                        "Logbook": "You can only review logbooks from your own supervised placements."
                    }
                )
        return data

    def create(self, validated_data):
        """
        After creating the review, update the logbook status.
        action='approved' → logbook.status = 'approved'
        action='reviewed' or 'revision_requested' → logbook.status = 'reviewed'
        """

        log_review = super().create(validated_data)

        logbook = log_review.Logbook
        action = log_review.action

        if action == "approved":
            logbook.status = "approved"
        elif action == "revision_requested":
            logbook.status = "draft"
        else:
            logbook.status = "reviewed"

        logbook.save()
        return log_review
