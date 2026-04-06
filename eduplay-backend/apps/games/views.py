from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import GameSession
from .serializers import GameSessionSerializer, GameSessionCreateSerializer, LeaderboardEntrySerializer
from apps.users.models import User


class GameSessionCreateView(generics.CreateAPIView):
    """POST /api/games/sessions/ — submit a completed game."""
    serializer_class   = GameSessionCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session = serializer.save()
        # Return the full session + updated user XP
        return Response({
            'session': GameSessionSerializer(session).data,
            'user_xp': request.user.xp,
            'user_level': request.user.level,
        }, status=status.HTTP_201_CREATED)


class MyGameHistoryView(generics.ListAPIView):
    """GET /api/games/sessions/my/ — current student's session history."""
    serializer_class   = GameSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = self.request.user.game_sessions.all()
        game_type = self.request.query_params.get('game_type')
        topic_id  = self.request.query_params.get('topic_id')
        if game_type:
            qs = qs.filter(game_type=game_type)
        if topic_id:
            qs = qs.filter(topic_id=topic_id)
        return qs[:50]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard_view(request):
    """GET /api/games/leaderboard/ — top students by XP."""
    subject_id   = request.query_params.get('subject')
    school_level = request.query_params.get('level', request.user.school_level)
    limit        = int(request.query_params.get('limit', 20))

    users = User.objects.filter(is_active=True, role='student')

    if school_level and school_level != 'all':
        users = users.filter(school_level=school_level)

    if subject_id:
        user_ids = GameSession.objects.filter(
            topic__subject_id=subject_id
        ).values_list('student_id', flat=True).distinct()
        users = users.filter(id__in=user_ids)

    users = users.order_by('-xp')[:limit]

    data = []
    for rank, user in enumerate(users, start=1):
        initials = ''
        if user.first_name: initials += user.first_name[0].upper()
        if user.last_name:  initials += user.last_name[0].upper()
        if not initials:    initials = user.username[:2].upper()

        display_name = f'{user.first_name} {user.last_name[0]}.' if user.last_name else user.first_name
        if not display_name.strip():
            display_name = user.username

        data.append({
            'rank':            rank,
            'user_id':         user.id,
            'username':        user.username,
            'display_name':    display_name,
            'avatar_initials': initials,
            'xp':              user.xp,
            'games_played':    user.game_sessions.count(),
            'is_current_user': user.id == request.user.id,
            'year_group':      user.year_group,
        })

    return Response(data)
