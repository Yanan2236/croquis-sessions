from django.contrib import admin
from .models import (
    Subject,
    CroquisSession,
    Drawing,
)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'created_at')
    search_fields = ('name', 'user__username')
    ordering = ('-created_at',)
    
@admin.register(CroquisSession)
class CroquisSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'subject', 'started_at', 'ended_at', 'is_public', 'created_at')
    search_fields = ('user__username', 'subject__name')
    list_filter = ('is_public', 'started_at', 'ended_at')
    ordering = ('-started_at',)
    

    
@admin.register(Drawing)
class DrawingAdmin(admin.ModelAdmin):
    list_display = ('id', 'session', 'created_at')
    search_fields = ('session__id',)
    ordering = ('-created_at',)
