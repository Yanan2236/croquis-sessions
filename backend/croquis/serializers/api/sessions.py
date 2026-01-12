from rest_framework import serializers
from django.utils import timezone

from croquis.models import CroquisSession
from croquis.exceptions import Conflict
from croquis.serializers.api.drawings import DrawingSerializer

class SessionStartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CroquisSession
        fields = ["subject", "intention"]
        
    def create(self, validated_data):
        request = self.context["request"]
        return CroquisSession.objects.create(user=request.user, **validated_data)
    
class SessionFinishSerializer(serializers.ModelSerializer):
    class Meta:
        model = CroquisSession
        fields = [
            "reflection",
            "next_action",
            "note",
            "is_public",
        ]

    def update(self, instance, validated_data):
        if instance.ended_at is not None:
            raise Conflict("Session has already been finished.")
        
        instance.ended_at = timezone.now()
        
        for key, value in validated_data.items():
            setattr(instance, key, value)
            
        instance.save()
        return instance
        

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CroquisSession
        fields = [
            "id",
            "user",
            "started_at",
            "ended_at",
            "subject",
            "intention",
            "reflection",
            "next_action",
            "note",
            "is_public",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "started_at", "ended_at", "created_at", "updated_at"]
        
class SessionDetailSerializer(serializers.ModelSerializer):
    drawings = DrawingSerializer(many=True, read_only=True)
    class Meta:
        model = CroquisSession
        fields = [
            "id",
            "user",
            "started_at",
            "ended_at",
            "subject",
            "intention",
            "reflection",
            "next_action",
            "note",
            "is_public",
            "created_at",
            "updated_at",
            "drawings",
        ]
        read_only_fields = ["id", "user", "started_at", "ended_at", "created_at", "updated_at", "drawings"]