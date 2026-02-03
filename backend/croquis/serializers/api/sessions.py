from rest_framework import serializers
from django.utils import timezone
from django.db import transaction
from django.db.models import F

from croquis.models import CroquisSession, Subject
from croquis.exceptions import Conflict
from .subjects import SubjectSerializer
from .drawings import DrawingSerializer, DrawingThumbnailSerializer

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
        with transaction.atomic():
            # select_for_update でロックをかけて再取得
            session = (
                CroquisSession.objects
                .select_for_update()
                .select_related("subject")
                .get(pk=instance.pk, user=instance.user)
            )

            if session.finalized_at is not None:
                raise Conflict("Session has already been finalized.")

            if session.ended_at is None:
                raise Conflict("Session has not been ended yet.")

            started_at = session.started_at
            ended_at = session.ended_at
            duration_seconds = int((ended_at - started_at).total_seconds())
            duration_seconds = max(0, duration_seconds)

            session.finalized_at = timezone.now()
            for key, value in validated_data.items():
                setattr(session, key, value)

            update_fields = ["finalized_at", *list(validated_data.keys())]
            session.save(update_fields=update_fields)

            Subject.objects.filter(
                id=session.subject_id,
                user=session.user,
            ).update(
                total_duration_seconds=F("total_duration_seconds") + duration_seconds,
                latest_session_id=session.pk,
            )

        return session
        

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
        
class SessionListSerializer(serializers.ModelSerializer):
    thumb_image = serializers.SerializerMethodField()
    subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = CroquisSession
        fields = [
            "id",
            "thumb_image",
            "subject",
            "finalized_at",
            "duration_seconds",
        ]
        
    def get_thumb_image(self, obj):
        drawing = obj.get_representative_drawing()
        if not drawing or not drawing.image_file:
            return None

        url = drawing.image_file.url
        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url


class SessionDetailSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    drawings = DrawingSerializer(many=True, read_only=True)
    
    class Meta:
        model = CroquisSession
        fields = [
            "id",
            "user",
            "started_at",
            "ended_at",
            "finalized_at",
            "subject",
            "intention",
            "next_action",
            "drawings",
            "duration_seconds",
        ]
        read_only_fields = fields
        
class SessionSummarySerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = CroquisSession
        fields = [
            "id",
            "started_at",
            "ended_at",
            "subject",
            "intention",
        ]
        read_only_fields = fields
        
        
class IncompleteSessionSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    state = serializers.SerializerMethodField()
    
    # SerializerMethodField は get_<field名>(obj) を自動呼び出しして値を返す
    def get_state(self, obj):
        if obj.ended_at is None:
            return "running"
        return "needs_finalize"

    class Meta:
            model = CroquisSession
            fields = [
                "id",
                "state",
                "subject_name",
                "started_at",
                "ended_at",
                "finalized_at",
            ]
            read_only_fields = fields
