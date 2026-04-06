from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Badge, StudentBadge
from .serializers import BadgeSerializer, StudentBadgeSerializer
from apps.games.models import GameSession


class MyBadgesView(generics.ListAPIView):
    """GET /api/progress/badges/my/ — badges earned by current user."""
    serializer_class   = StudentBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudentBadge.objects.filter(
            student=self.request.user
        ).select_related('badge')


class AllBadgesView(generics.ListAPIView):
    """GET /api/progress/badges/ — all badges (for a badge wall)."""
    serializer_class   = BadgeSerializer
    permission_classes = [IsAuthenticated]
    queryset           = Badge.objects.filter(is_active=True)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_stats_view(request):
    """GET /api/progress/stats/ — current user's learning stats."""
    user     = request.user
    sessions = user.game_sessions.all()
    total    = sessions.count()

    avg_accuracy = 0
    if total > 0:
        avg_accuracy = round(
            sum(s.score / s.total for s in sessions if s.total > 0) / total * 100
        )

    by_type = {}
    for gt in ['quiz', 'flashcard', 'scramble', 'match']:
        type_sessions = sessions.filter(game_type=gt)
        by_type[gt] = {
            'count':        type_sessions.count(),
            'total_xp':     sum(s.xp_earned for s in type_sessions),
            'avg_accuracy': round(
                sum(s.score / s.total for s in type_sessions if s.total > 0)
                / type_sessions.count() * 100
            ) if type_sessions.count() > 0 else 0,
        }

    subjects_played = sessions.values(
        'topic__subject__name', 'topic__subject__icon'
    ).distinct()

    return Response({
        'xp':              user.xp,
        'level':           user.level,
        'streak':          user.streak,
        'total_games':     total,
        'avg_accuracy':    avg_accuracy,
        'total_xp_earned': sum(s.xp_earned for s in sessions),
        'by_game_type':    by_type,
        'subjects_played': list(subjects_played),
    })
