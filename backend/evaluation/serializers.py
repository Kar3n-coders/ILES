from rest_framework import serializers

from .models import Evaluation, EvaluationCriteria


# Evaluation Criteria Serializer
class EvaluationCriteriaSerializer(serializers.ModelSerializer):
    """Simple serializer for the scoring criteria."""

    class Meta:
        model = EvaluationCriteria
        fields = ["id", "name", "description", "weight"]

    def validate_weight(self, value):
        """Weight must be between 0.01 and 1.00."""
        if value <= 0 or value > 1:
            raise serializers.ValidationError("Weight must be between 0.01 and 1.00")
        return value
    


class EvaluationSerializer(serializers.ModelSerializer):
     """
     Fill serializer for reading evalution data.
     Show human-readable names rather than just IDs.
     """
     criteria_name = serializers.CharField(
          source='criteria.name',
          read_only=True
     )
     criteria_weight = serializers.FloatField(
          source='criteria.weight',
          read_only=True
     )
     evalutor_username = serializers.CharField(
          source='evalutor.username',
          read_only=True
          
     )
     student_username = serializers.CharField(
           source='placement.student.name',
          read_only=True
     )
     

     class Meta:
          model = Evaluation
          fields = [
               'id',
               'placement',
               'company_name',
               'evalutor',
               'evalutor_username',
               'evalutor_type',
               'evalutor_type_display',
               'criteria',
               'criteria_name',
               'criteria_weight',
               'score',
               'weight_score'
               'is_finalised',
               'evaluated_at',
               'student_username',
          ]
          read_only_fields = ['weighted_score', 'evaluated_at', 'evalutor']




class EvaluationCreateSerializer(serializers.ModelSerializer):
     """
     Lighter serializer for submitting a new evalution score.
     The evalutor is set automatically from request.user.
     weighted_score is calculated in the model's save().
     """
     class Meta:
          model = Evaluation
          fields = [ 
               'placement',
               'evalutor_type',
               'criteria',
               'score',
               'is_finalised',
          ]
     def validate_score(self, value):
          """Score must be on a 1-5 scale."""
          if value < 1 or value > 5:
               raise serializers.ValidationError(
                    "Score must be between 1 and 5."
               )
          return value
     
     def validate(self, data):
          """
          Verify that the supervisor is actually linked to this placement.
          A supervisor should not be able to evaluate students they don't supervise.
          """
          request = self.context.get('request')
          if request and request.user:
               placement = data.get('placement')
               if placement and placement.supervisor!=request.user:
                    if request.user.role!='internship_admin':
                         raise serializers.ValidationError({
                              'placement': "You can only evalute student in your own supervised placements."
                         })
                    return data 
                 

          
          
          






class EvaluationSerializer(serializers.ModelSerializer):
    """
    Fill serializer for reading evalution data.
    Show human-readable names rather than just IDs.
    """

    criteria_name = serializers.CharField(source="criteria.name", read_only=True)
    criteria_weight = serializers.FloatField(source="criteria.weight", read_only=True)
    evalutor_username = serializers.CharField(
        source="evalutor.username", read_only=True
    )
    student_username = serializers.CharField(
        source="placement.student.name", read_only=True
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
            "weight_scoreis_finalised",
            "evaluated_at",
            "student_username",
        ]
        read_only_fields = ["weighted_score", "evaluated_at", "evalutor"]

# Evaluation Serializer
class EvaluationSerializer(serializers.ModelSerializer):
    """
    Fill serializer for reading evalution data.
    Show human-readable names rather than just IDs.
    """

    criteria_name = serializers.CharField(source="criteria.name", read_only=True)
    criteria_weight = serializers.FloatField(source="criteria.weight", read_only=True)
    evalutor_username = serializers.CharField(
        source="evalutor.username", read_only=True
    )
    student_username = serializers.CharField(
        source="placement.student.name", read_only=True
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
            "weight_scoreis_finalised",
            "evaluated_at",
            "student_username",
        ]
        read_only_fields = ["weighted_score", "evaluated_at", "evalutor"]


# Evaluation Create Serializer for get method
class EvaluationCreateSerializer(serializers.ModelSerializer):
    """
    Lighter serializer for submitting a new evalution score.
    The evalutor is set automatically from request.user.
    weighted_score is calculated in the model's save().
    """

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
        """Score must be on a 1-5 scale."""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Score must be between 1 and 5.")
        return value

    def validate(self, data):
        """
        Verify that the supervisor is actually linked to this placement.
        A supervisor should not be able to evaluate students they don't supervise.
        """
        request = self.context.get("request")
        if request and request.user:
            placement = data.get("placement")
            if placement and placement.supervisor != request.user:
                if request.user.role != "internship_admin":
                    raise serializers.ValidationError(
                        {
                            "placement": "You can only evalute student in your own supervised placements."
                        }
                    )
                return data
