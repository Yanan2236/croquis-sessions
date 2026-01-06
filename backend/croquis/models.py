from django.db import models
from django.conf import settings
    

class CroquisSession(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='croquis_sessions'
    )
    duration_seconds = models.PositiveIntegerField()
    note=models.TextField(blank=True)
    
    tags = models.ManyToManyField(
        'MotifTag', 
        through='SessionTag',
        related_name='sessions',
    )
    focuses = models.ManyToManyField(
        'Focus', 
        through='SessionFocus',
        related_name='sessions',
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
class MotifGroup(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='motif_groups'
    )
    name = models.CharField(max_length=200)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['owner', 'name'],
                name='unique_group_per_owner',
            )
        ]
    
class MotifTag(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='motif_tags'
    )
    group = models.ForeignKey(MotifGroup, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=200)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['owner', 'group', 'name'],
                name='unique_tag_in_group_per_owner',
            )
        ]
    
class SessionTag(models.Model):
    session = models.ForeignKey(CroquisSession, on_delete=models.CASCADE, related_name='session_tags')
    tag = models.ForeignKey(MotifTag, on_delete=models.CASCADE, related_name='tag_sessions')
    
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['session', 'tag'],
                name='unique_session_tag',
            ),
            models.UniqueConstraint(
                fields=['session'],
                condition=models.Q(is_primary=True),
                name='unique_primary_tag_per_session',
            ),
        ]
    
    
class Focus(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='focuses'
    )
    title = models.CharField(max_length=200)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['owner', 'title'],
                name='unique_focus_per_owner',
            )
        ]
    
class SessionFocus(models.Model):
    session = models.ForeignKey(CroquisSession, on_delete=models.CASCADE, related_name='session_focuses')
    focus = models.ForeignKey(Focus, on_delete=models.CASCADE, related_name='focus_sessions')
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['session', 'focus'],
                name='unique_session_focus',
            )
        ]
    
class Image(models.Model):
    session = models.ForeignKey(CroquisSession, on_delete=models.CASCADE, related_name='images')
    image_file = models.ImageField(upload_to='croquis_images/')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)