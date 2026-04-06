from rest_framework import serializers
from .models import GameSession
from apps.users.serializers import UserSerializer


class GameSessionSerializer(serializers.ModelSerializer):
    accuracy_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model  = GameSession
        fields = [
            'id', 'game_type', 'topic_id', 'score', 'total',
            'xp_earned', 'duration_seconds', 'completed_at', 'accuracy_percent',
        ]
        read_only_fields = ['id', 'completed_at', 'accuracy_percent']


class GameSessionCreateSerializer(serializers.ModelSerializer):
    """Used when student submits a completed game."""

    class Meta:
        model  = GameSession
        fields = ['game_type', 'topic_id', 'score', 'total', 'xp_earned', 'duration_seconds']

    def validate(self, data):
        if data['score'] > data['total']:
            raise serializers.ValidationError({'score': 'Score cannot exceed total.'})
        if data['total'] == 0:
            raise serializers.ValidationError({'total': 'Total must be greater than zero.'})
        return data

    def create(self, validated_data):
        student = self.context['request'].user
        session = GameSession.objects.create(student=student, **validated_data)
        # Update XP and streak on the user
        student.add_xp(session.xp_earned)
        student.update_streak()
        # Trigger badge checks
        from apps.progress.services import check_and_award_badges
        check_and_award_badges(student)
        return session


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    display_name    = serializers.SerializerMethodField()
    avatar_initials = serializers.SerializerMethodField()
    games_played    = serializers.SerializerMethodField()
    rank            = serializers.SerializerMethodField()
    year_group      = serializers.CharField(read_only=True)

    class Meta:
        model  = GameSession.student.field.related_model
        fields = [
            'id', 'username', 'display_name', 'avatar_initials',
            'xp', 'games_played', 'rank', 'year_group',
        ]

    def get_display_name(self, obj):
        name = f'{obj.first_name} {obj.last_name[0]}.' if obj.last_name else obj.first_name
        return name or obj.username

    def get_avatar_initials(self, obj):
        fi = obj.first_name[0].upper() if obj.first_name else ''
        li = obj.last_name[0].upper()  if obj.last_name  else ''
        return fi + li or obj.username[:2].upper()

    def get_games_played(self, obj):
        return obj.game_sessions.count()

    def get_rank(self, obj):
        from apps.users.models import User
        return User.objects.filter(xp__gt=obj.xp).count() + 1
