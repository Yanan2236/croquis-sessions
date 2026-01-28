from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404

from croquis.models import CroquisSession, Drawing
from croquis.serializers.api.drawings import DrawingSerializer, DrawingCreateSerializer
from croquis.exceptions import Conflict

class DrawingViewSet(ModelViewSet):
    lookup_value_regex = r"\d+"
    http_method_names = ["get", "post", "head", "options"]
    
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_session(self):
        session_pk = self.kwargs.get("session_pk")
        if session_pk is None:
            raise NotFound("session_pk not found in URL.")
        return get_object_or_404(CroquisSession, pk=session_pk, user=self.request.user)

    def ensure_session_editable(self, session: CroquisSession) -> None:
        if session.ended_at is not None:
            raise Conflict("Session has already been finished.")

    def get_queryset(self):
        session = self.get_session()
        return Drawing.objects.filter(session=session)

    def get_serializer_class(self):
        if self.action == "create":
            return DrawingCreateSerializer
        return DrawingSerializer

    def perform_create(self, serializer):
        session = self.get_session()
        serializer.save(session=session)

    def perform_update(self, serializer):
        session = self.get_session()
        self.ensure_session_editable(session)
        serializer.save()

    def perform_destroy(self, instance):
        session = self.get_session()
        self.ensure_session_editable(session)
        instance.delete()