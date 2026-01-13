from django.db import models
from django.conf import settings
from django.utils import timezone
    


class Subject(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subjects",
    )
    name = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'name'],
                name='unique_subject_per_user'
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

    subject = models.ForeignKey(
        "Subject",
        on_delete=models.PROTECT,
        related_name="croquis_sessions",
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
        blank=True,
        null=True,
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
    
    class Meta:
        ordering = ['-started_at', 'created_at']

    def __str__(self):
        return f"CroquisSession {self.id} - {self.user} - {self.subject}"

    
    
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