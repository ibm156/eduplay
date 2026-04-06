from rest_framework import serializers
from .models import Badge, StudentBadge


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Badge
        fields = ['id', 'name', 'icon', 'description']


class StudentBadgeSerializer(serializers.ModelSerializer):
    id          = serializers.IntegerField(source='badge.id')
    name        = serializers.CharField(source='badge.name')
    icon        = serializers.CharField(source='badge.icon')
    description = serializers.CharField(source='badge.description')

    class Meta:
        model  = StudentBadge
        fields = ['id', 'name', 'icon', 'description', 'earned_at']
