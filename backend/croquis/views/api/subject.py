from django.db.models import F, Sum, DurationField, ExpressionWrapper
from django.db.models.functions import Coalesce

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.status import HTTP_201_CREATED
from rest_framework import status

from croquis.models import Subject, CroquisSession
from croquis.serializers.api.subjects import (
    SubjectSerializer, 
    SubjectOverviewSerializer, 
    SubjectWriteSerializer,
    SubjectOptionsSerializer,
)


class SubjectViewSet(ModelViewSet):
    lookup_value_regex = r"\d+"
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    permission_classes = [IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = []
    ordering_fields = ["total_duration_seconds"]
    ordering = ["-total_duration_seconds"]

    def get_queryset(self):
        qs = Subject.objects.filter(user=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action == "overview":
            return SubjectOverviewSerializer
        if self.action == "options":
            return SubjectOptionsSerializer
        if self.action in ("create", "update", "partial_update"):
            return SubjectWriteSerializer
        return SubjectSerializer
    
    @action(detail=False, methods=["get"])
    def options(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def overview(self, request):
        qs = self.filter_queryset(self.get_queryset()).select_related("latest_session")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def create(self, request, *args, **kwargs):
        in_serializer = self.get_serializer(data=request.data)
        in_serializer.is_valid(raise_exception=True)
        self.perform_create(in_serializer)
        subject = in_serializer.instance
        
        out_serializer = SubjectOverviewSerializer(subject, context=self.get_serializer_context())
        return Response(out_serializer.data, status=HTTP_201_CREATED)
        
    def partial_update(self, request, *args, **kwargs):
        subject = self.get_object()
        in_serializer = self.get_serializer(subject, data=request.data, partial=True)
        in_serializer.is_valid(raise_exception=True)
        self.perform_update(in_serializer)
        subject = in_serializer.instance
        
        out_serializer = SubjectOverviewSerializer(subject, context=self.get_serializer_context())
        return Response(out_serializer.data)
    
    def perform_destroy(self, instance):
        return instance.delete_by_policy()
    
    def destroy(self, request, *args, **kwargs):
        subject = self.get_object()
        result = self.perform_destroy(subject)
        return Response(status=status.HTTP_200_OK, data={"delete_type": result.value})