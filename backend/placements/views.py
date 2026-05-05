from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions,status
from rest_framework.response import Response
from .models import InternshipPlacement
from .serializers import PlacementSerializer, PlacementCreateSerializer
from user.permissions import IsAdmin


class PlacementViewset(viewsets.ModelViewSet):
    """
    ViewSet for InternshipPlacement.


    Access rules:
    -Admin:full CRUD (create,read,update,delete)
    -Supervisor: read only(their supervised placements)
    -Student: read only (their own plaxement)
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        """Use lighter serializer when creating/updating."""
        if self.action in ['create','update','partial_update']:
            return PlacementCreateSerializer
        return PlacementSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role = 'internship_admin':
            return InternshipPlacement.objects.all().select_related(
                'student','supervisor'
            ).prefetch_related('Weekly_logs')

        elif user.role in ['workplace_supervisor','academic_supervisor']:

            return InternshipPlacement.objects.filter(
                supervisor=user
            ).selected_related('student','supervisor').prefetch_related('Weekly_logs')


        elif user.role = 'student':

            return InternshipPlacement.objects.filter(
                student=user
            ).select_related('supervisor').prefetch_related('Weekly_logs')

        return InternshipPlacement.objects.none()


    def create(self,request,*args, **kwargs):
        """Only admins can create placements."""
        if request.user.role != 'internship_admin':
            return Response(
                {"error":"Only administrators can create placements."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request,*args,**kwargs)

    def update(self,request,*args,**kwargs):
        """Only admins can update placements."""
        if request.user.role != 'internship_admin':
            return Response(
                {"error": "Only administrators can update placements."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request,*args,**kwargs)

    def destroy(self,request,*args,**kwargs):
        """
        Only admins can delete placements.
        Warn: deleting a placement cascades to logbooks and evaluations!
        """
        if request.user.role != 'internship_admin':
            return Response(
                {"error": "Only administrators can delete placements."},
                status=status.HTTP_403_FORBIDDEN
            )
        placement = self.get_object()
        logbook_count = placement.Weekly_logs.count()



        if logbook_count >0:
            return Response(
                {
                    "error": f"Cannot delete placement with {logbook_count} logbook entries.Archive it instead."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


            super().destroy(request,*args,**kwargs)
