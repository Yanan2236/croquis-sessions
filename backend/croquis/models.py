from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Q
from enum import Enum
    
class DeleteResult(Enum):
    SOFT = "soft"
    HARD = "hard"

class SubjectQuerySet(models.QuerySet):
    def alive(self):
        return self.filter(deleted_at__isnull=True)
    
    def dead(self):
        return self.filter(deleted_at__isnull=False)
    
class SubjectManager(models.Manager):
    def get_queryset(self):
        return SubjectQuerySet(self.model, using=self._db).alive()

class Subject(models.Model):
    objects = SubjectManager()      # デフォルトは生存だけ取得
    all_objects = models.Manager()  # 全取得用
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subjects",
    )
    name = models.CharField(max_length=255)
    
    total_duration_seconds = models.BigIntegerField(default=0)

    latest_session = models.ForeignKey(
        "CroquisSession",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="+",
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    deleted_at = models.DateTimeField(blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    
    def delete_by_policy(self):
        if self.sessions.exists():
            return self.soft_delete()
        else:
            return self.hard_delete()
        
    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save(update_fields=["deleted_at", "is_active"])
        return DeleteResult.SOFT
        
    def hard_delete(self):
        super().delete()
        return DeleteResult.HARD
        
    def restore(self):
        self.deleted_at = None
        self.is_active = False
        self.save(update_fields=["deleted_at", "is_active"])
    
    
    def __str__(self):
        return self.name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                condition=Q(deleted_at__isnull=True),
                name="unique_alive_subject_per_user",
            )
        ]



class CroquisSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="croquis_sessions",
    )

    started_at = models.DateTimeField(default=timezone.now)
    ended_at = models.DateTimeField(blank=True, null=True)
    finalized_at = models.DateTimeField(blank=True, null=True)

    subject = models.ForeignKey(
        "Subject",
        on_delete=models.PROTECT,
        related_name="sessions",
        help_text="セッションの主題",
    )

    intention = models.TextField(
        blank=True,
        null=True,
        help_text="今セッションで意識すること",
    )

    # Session Review Fields
    reflection = models.TextField(
        blank=True,
        null=True,
        help_text="セッションの振り返り",
    )

    next_action = models.TextField(
        blank=False,
        null=False,
        help_text="次回セッションで意識すること",
    )

    note = models.TextField(
        blank=True,
        null=True,
        help_text="補足メモ（任意）",
    )

    is_public = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def duration_seconds(self):
        if not self.started_at or not self.ended_at:
            return None
        duration_seconds = int((self.ended_at - self.started_at).total_seconds())
        return max(0, duration_seconds)
    
    class Meta:
        ordering = ['-started_at', 'created_at']
        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                condition=Q(finalized_at__isnull=True),
                name="unique_user_incomplete_session",
            )
        ]

    def __str__(self):
        return f"CroquisSession {self.id} - {self.user} - {self.subject}"
    
    def get_representative_drawing(self):
        return self.drawings.first()
        
    
class Drawing(models.Model):
    session = models.ForeignKey(
        CroquisSession,
        on_delete=models.CASCADE,
        related_name="drawings",
    )

    image_file = models.ImageField(upload_to="croquis_drawings/")
    order = models.PositiveIntegerField(
        default=0,
        help_text="セッション内の並び順（任意）",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"Drawing {self.id} (Session {self.session.id})"