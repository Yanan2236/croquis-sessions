from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.utils import timezone
from django.db import transaction

from croquis.models import CroquisSession
from croquis.serializers.api.sessions import (
    SessionSerializer,
    SessionStartSerializer, 
    SessionFinishSerializer,
    SessionDetailSerializer,
    SessionSummarySerializer,
)

class SessionViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch"]
    
    permission_classes = [IsAuthenticated]
    
    '/api/croquis/sessions/${sessionId}/'
    '/api/croquis/sessions/active/?ended_at__isnull=true'
    
    def get_queryset(self):
        return CroquisSession.objects.select_related("subject").filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == "create":
            return SessionStartSerializer
        if self.action in ("update", "partial_update"):
            return SessionFinishSerializer
        if self.action == "retrieve":
            return SessionDetailSerializer
        if self.action == "active":
            return SessionDetailSerializer
        if self.action  == "end":
            return SessionSummarySerializer
        return SessionSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context
    
    def create(self, request, *args, **kwargs):
        in_serializer = self.get_serializer(data=request.data)
        in_serializer.is_valid(raise_exception=True) # request.dataのバリデーション→validated_data生成
        session = in_serializer.save()               # validated_dataを使ってインスタンス生成・保存
        
        out_serializer = SessionSerializer(session, context=self.get_serializer_context())
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)


    def partial_update(self, request, *args, **kwargs):
        session = self.get_object()
        in_serializer = self.get_serializer(session, data=request.data, partial=True)
        in_serializer.is_valid(raise_exception=True)
        session = in_serializer.save()
        
        out_serializer = SessionDetailSerializer(session, context=self.get_serializer_context())
        return Response(out_serializer.data, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=["get"])
    def active(self, request):
        qs = self.get_queryset().filter(ended_at__isnull=True).order_by("-started_at")[:2]
        n = len(qs)
        if n == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)
        if n == 1:
            serializer = self.get_serializer(qs[0])
            return Response(serializer.data, status=status.HTTP_200_OK)
        if n == 2:
            return Response(
                {"detail": "Multiple active sessions found."},
                status=status.HTTP_409_CONFLICT,
            )
            
    @action(detail=True, methods=["patch"])
    def end(self, request, pk=None):
        now = timezone.now()
        
        # 二重送信対策：atomic+select_for_update
        with transaction.atomic():
            session = (
                self.get_queryset()
                .select_for_update() # 行ロック付きで取得
                .get(pk=pk)
            )
            
            if session.ended_at is not None:
                serializer = self.get_serializer(session)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            session.ended_at = now
            session.save(update_fields=["ended_at"]) # ended_atのみ更新
            # 入力がないのでserializerは使わない
            
        serializer = self.get_serializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)
