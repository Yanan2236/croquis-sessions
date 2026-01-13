from rest_framework import serializers
from django.utils import timezone

from croquis.models import CroquisSession, Subject
from croquis.exceptions import Conflict
from croquis.serializers.api.drawings import DrawingSerializer

class SessionStartSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = CroquisSession
        fields = ["subject_name", "intention"]
        
    def validate_subject_name(self, value):
        value = value.strip()
        value = value.replace("\u3000", " ")
        value = " ".join(value.split())
        
        if not value:
            raise serializers.ValidationError("subject_name is required.")
        return value

    def create(self, validated_data):
        request = self.context["request"]
        
        subject, created = Subject.objects.get_or_create(
            user=request.user,
            name=validated_data["subject_name"], 
        )
        validated_data["subject"] = subject
        validated_data.pop("subject_name")
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