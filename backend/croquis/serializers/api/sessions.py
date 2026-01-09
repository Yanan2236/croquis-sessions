from rest_framework import serializers
from croquis.models import CroquisSession

class CroquisSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CroquisSession
        fields = ["id", "duration_seconds", "note", "created_at", "updated_at"]