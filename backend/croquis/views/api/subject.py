from django.db.models import F, Sum, DurationField, ExpressionWrapper
from django.db.models.functions import Coalesce

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from croquis.models import Subject, CroquisSession
from croquis.serializers.api.subjects import SubjectSerializer, SubjectOverviewSerializer


class SubjectViewSet(ModelViewSet):
    http_method_names = ["get", "head", "options"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Subject.objects.filter(user=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action == "overview":
            return SubjectOverviewSerializer
        return SubjectSerializer

    @action(detail=False, methods=["get"])
    def overview(self, request):
        qs = self.filter_queryset(self.get_queryset()).select_related("latest_session")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
        
        