from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from croquis.models import CroquisSession
from croquis.serializers.api.sessions import (
    SessionSerializer,
    SessionStartSerializer, 
    SessionFinishSerializer,
    SessionDetailSerializer,
)

class SessionViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch"]
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CroquisSession.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == "create":
            return SessionStartSerializer
        if self.action in ("update", "partial_update"):
            return SessionFinishSerializer
        if self.action == "retrieve":
            return SessionDetailSerializer
        return SessionSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context
    
    def create(self, request, *args, **kwargs):
        in_serializer = self.get_serializer(data=request.data)
        in_serializer.is_valid(raise_exception=True)
        session = in_serializer.save()
        
        out_serializer = SessionSerializer(session, context=self.get_serializer_context())
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)


    def partial_update(self, request, *args, **kwargs):
        session = self.get_object()
        in_serializer = self.get_serializer(session, data=request.data, partial=True)
        in_serializer.is_valid(raise_exception=True)
        session = in_serializer.save()
        
        out_serializer = SessionSerializer(session, context=self.get_serializer_context())
        return Response(out_serializer.data, status=status.HTTP_200_OK)