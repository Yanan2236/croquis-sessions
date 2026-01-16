from rest_framework import serializers
from croquis.models import Subject, CroquisSession

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
        ]
        read_only_fields = fields
        
class LatestSessionMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = CroquisSession
        fields = [
            "id",
            "ended_at",
            "next_action",
        ]
        read_only_fields = fields

class SubjectOverviewSerializer(serializers.ModelSerializer):
    latest_session = LatestSessionMiniSerializer(read_only=True)
    
    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "total_duration_seconds",
            "latest_session",
        ]
        read_only_fields = fields

        
