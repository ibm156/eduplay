from django.contrib import admin
from .models import GameSession


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display  = ['student', 'game_type', 'topic', 'score', 'total', 'xp_earned', 'completed_at']
    list_filter   = ['game_type', 'completed_at']
    search_fields = ['student__username', 'topic__title']
    readonly_fields = ['completed_at']
    date_hierarchy = 'completed_at'
