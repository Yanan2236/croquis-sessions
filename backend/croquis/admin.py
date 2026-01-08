# croquis/admin.py
from django.contrib import admin
from .models import (
    CroquisSession,
    MotifGroup,
    MotifTag,
    SessionTag,
    Focus,
    SessionFocus,
    Image,
)


class SessionTagInline(admin.TabularInline):
    model = SessionTag
    extra = 0
    autocomplete_fields = ("tag",)
    fields = ("tag", "is_primary")


class SessionFocusInline(admin.TabularInline):
    model = SessionFocus
    extra = 0
    autocomplete_fields = ("focus",)
    fields = ("focus",)


class ImageInline(admin.TabularInline):
    model = Image
    extra = 0
    fields = ("image_file",)


@admin.register(CroquisSession)
class CroquisSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "created_at", "duration_seconds")
    list_filter = ("owner", "created_at")
    search_fields = ("note",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
    inlines = [SessionTagInline, SessionFocusInline, ImageInline]


@admin.register(MotifGroup)
class MotifGroupAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "name", "created_at")
    list_filter = ("owner",)
    search_fields = ("name",)
    ordering = ("owner", "name")


@admin.register(MotifTag)
class MotifTagAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "group", "name", "created_at")
    list_filter = ("owner", "group")
    search_fields = ("name", "group__name")
    ordering = ("owner", "group__name", "name")


@admin.register(Focus)
class FocusAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "title", "created_at")
    list_filter = ("owner",)
    search_fields = ("title",)
    ordering = ("owner", "title")
