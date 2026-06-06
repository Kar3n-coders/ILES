from rest_framework import serializers

from .models import Evaluation, EvaluationCriteria


class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCriteria
        fields = ["id", "name", "description", "weight"]

    def validate_weight(self, value):
        if value <= 0 or value > 1:
            raise serializers.ValidationError("Weight must be between 0.01 and 1.00")
        return value


class EvaluationSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="placement.company_name", read_only=True)
    criteria_name = serializers.CharField(source="criteria.name", read_only=True)
    criteria_weight = serializers.FloatField(source="criteria.weight", read_only=True)
    evalutor_username = serializers.CharField(
        source="evalutor.username", read_only=True
    )
    student_username = serializers.CharField(
        source="placement.student.username", read_only=True
    )
    evalutor_type_display = serializers.CharField(
        source="get_evalutor_type_display", read_only=True
    )

    class Meta:
        model = Evaluation
        fields = [
            "id",
            "placement",
            "company_name",
            "evalutor",
            "evalutor_username",
            "evalutor_type",
            "evalutor_type_display",
            "criteria",
            "criteria_name",
            "criteria_weight",
            "score",
            "weighted_score",
            "is_finalised",
            "evaluated_at",
            "student_username",
        ]
        read_only_fields = ["weighted_score", "evaluated_at", "evalutor", "company_name", "student_username", "evalutor_type_display", "evalutor_username", "criteria_name", "criteria_weight"]


class EvaluationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = [
            "placement",
            "evalutor_type",
            "criteria",
            "score",
            "is_finalised",
        ]

    def validate_score(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Score must be between 1 and 5.")
        return value

    def validate(self, data):
        request = self.context.get("request")
        if request and request.user:
            placement = data.get("placement")
            if placement and placement.supervisor != request.user:
                if request.user.role != "internship_admin":
                    raise serializers.ValidationError(
                        {
                            "placement": "You can only evaluate students in your own supervised placements."
                        }
                    )
        return data
