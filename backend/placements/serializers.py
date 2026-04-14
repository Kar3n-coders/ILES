from rest_framework import serializers
from .models import InternshipPlacement
from django.contrib.auth import get_user_model


User = get_user_model()


class PlacementSerializer(serializers.ModelSerializer):
    """
    Serializer for reading placement data.
    We expose rich information about the student and supervisor
    rather than just their IDS.
    """


    student_username = serializers.CharField(
        source='student.username',
        read_only=True
    )
    student_full_name = serializers.SerializerMethodField()

    supervisor_username = serializers.CharField(
        source='supervisor.username',
        read_only=True
    )
    supervisor_full_name = serializers.SerializerMethodField()



    logbook_count = serializers.SerializerMethodField()

    class Meta:
        model = InternshipPlacement
        fields = [
            'id',
            'student',
            'student_username',
            'student_full_name',
            'company_name',
            'start_date',
            'end_date',
            'supervisor',
            'supervisor_username',
            'supervisor_full_name',
            'logbook_count',
        ]