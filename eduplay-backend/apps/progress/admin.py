from django.contrib import admin
from .models import Badge, StudentBadge


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display  = ['icon', 'name', 'criteria_key', 'is_active']
    list_editable = ['is_active']
    search_fields = ['name', 'criteria_key']


@admin.register(StudentBadge)
class StudentBadgeAdmin(admin.ModelAdmin):
    list_display  = ['student', 'badge', 'earned_at']
    list_filter   = ['badge']
    search_fields = ['student__username', 'badge__name']
    readonly_fields = ['earned_at']
