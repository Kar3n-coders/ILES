from django.db.models import Sum
from django.shortcuts import render
from placements.models import InternshipPlacement
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Evaluation, EvaluationCriteria
from .serializers import (
    EvaluationCreateSerializer,
    EvaluationCriteriaSerializer,
    EvaluationSerializer,
)


class EvaluationCriteriaViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCriteria.objects.all()
    serializer_class = EvaluationCriteriaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.role != "internship_admin":
            return Response(
                {"error": "Only administrators can create evaluation criteria."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "internship_admin":
            return Response(
                {"error": "Only administrators can delete criteria."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)


class EvaluationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return EvaluationCreateSerializer
        return EvaluationSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "internship_admin":
            return Evaluation.objects.all().select_related(
                "placement", "evalutor", "criteria", "placement__student"
            )

        elif user.role in ["workplace_supervisor", "academic_supervisor"]:
            return Evaluation.objects.filter(evalutor=user).select_related(
                "placement", "evalutor", "criteria", "placement__student"
            )

        elif user.role == "student":
            return Evaluation.objects.filter(
                placement__student=user, is_finalised=True
            ).select_related("placement", "evalutor", "criteria")

        return Evaluation.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        if user.role not in ["workplace_supervisor", "academic_supervisor"]:
            raise PermissionDenied("Only supervisors can submit evaluations.")

        evalutor_type = (
            "workplace" if user.role == "workplace_supervisor" else "academic"
        )

        serializer.save(evalutor=user, evalutor_type=evalutor_type)

    @action(detail=False, methods=["get"], url_path=r"summary/(?P<placement_id>[^/.]+)")
    def summary(self, request, placement_id=None):
        try:
            placement = InternshipPlacement.objects.select_related("student").get(
                pk=placement_id
            )
        except InternshipPlacement.DoesNotExist:
            return Response(
                {"error": "Placement not found."}, status=status.HTTP_404_NOT_FOUND
            )

        user = request.user

        if user.role == "student" and placement.student != user:
            return Response(
                {"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN
            )

        evaluations = Evaluation.objects.filter(
            placement=placement, is_finalised=True
        ).select_related("criteria", "evalutor")

        total_score = evaluations.aggregate(total=Sum("weighted_score"))["total"] or 0

        max_possible = (
            EvaluationCriteria.objects.aggregate(total_weight=Sum("weight"))[
                "total_weight"
            ]
            or 0
        ) * 5

        breakdown = [
            {
                "criteria": ev.criteria.name,
                "weight": ev.criteria.weight,
                "score": ev.score,
                "weighted_score": ev.weighted_score,
                "evaluated_by": ev.evalutor.username,
            }
            for ev in evaluations
        ]

        percentage = (total_score / max_possible * 100) if max_possible > 0 else 0

        return Response(
            {
                "placement_id": placement.pk,
                "student": placement.student.username if placement.student else None,
                "company": placement.company_name,
                "total_weighted_score": round(total_score, 2),
                "max_possible_score": round(max_possible, 2),
                "percentage": round(percentage, 1),
                "breakdown": breakdown,
                "evaluation_count": evaluations.count(),
            }
        )


# Create your views here.
