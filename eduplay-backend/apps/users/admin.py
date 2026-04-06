from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ['username', 'email', 'first_name', 'last_name', 'role', 'school_level', 'xp', 'level', 'streak']
    list_filter   = ['role', 'school_level', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering      = ['-xp']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('EduPlay', {
            'fields': ('role', 'school_level', 'year_group', 'avatar', 'xp', 'level', 'streak', 'last_played'),
        }),
    )
