from django.shortcuts import render
from rest_framework import generics
from croquis.models import CroquisSession
from croquis.serializers.api.sessions import CroquisSessionSerializer

class CroquisSessionListView(generics.ListAPIView):
    serializer_class = CroquisSessionSerializer

    def get_queryset(self):
        return CroquisSession.objects.filter(owner=self.request.user).order_by('-created_at')
    