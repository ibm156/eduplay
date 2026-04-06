"""
Badge criteria service.
Each criterion function receives the student and returns True if the badge should be awarded.
"""
from apps.users.models import User
from .models import Badge, StudentBadge


def _award_if_not_owned(student: User, badge: Badge) -> bool:
    """Award badge and return True if student doesn't already have it."""
    _, created = StudentBadge.objects.get_or_create(student=student, badge=badge)
    return created


CRITERIA = {
    'first_game': lambda s: s.game_sessions.count() >= 1,
    'perfect_score': lambda s: s.game_sessions.filter(score=models_total()).exists(),
    'streak_5':  lambda s: s.streak >= 5,
    'streak_10': lambda s: s.streak >= 10,
    'streak_30': lambda s: s.streak >= 30,
    'xp_500':    lambda s: s.xp >= 500,
    'xp_1000':   lambda s: s.xp >= 1000,
    'xp_5000':   lambda s: s.xp >= 5000,
    'top_3':     lambda s: _is_top_n(s, 3),
    'games_10':  lambda s: s.game_sessions.count() >= 10,
    'games_50':  lambda s: s.game_sessions.count() >= 50,
    'all_subjects': lambda s: _played_all_subjects(s),
}


def _is_top_n(student: User, n: int) -> bool:
    return User.objects.filter(xp__gt=student.xp).count() < n


def _played_all_subjects(student: User) -> bool:
    from apps.content.models import Subject
    from apps.games.models import GameSession
    total = Subject.objects.filter(is_active=True).count()
    played = GameSession.objects.filter(
        student=student
    ).values('topic__subject_id').distinct().count()
    return total > 0 and played >= total


def models_total():
    """Helper — not used directly, placeholder for perfect_score lambda."""
    from django.db.models import F
    return F('total')


def check_and_award_badges(student: User) -> list:
    """Check all badge criteria and award any newly earned badges. Returns list of new badge names."""
    new_badges = []
    active_badges = Badge.objects.filter(is_active=True)

    for badge in active_badges:
        # Skip if already owned
        if StudentBadge.objects.filter(student=student, badge=badge).exists():
            continue

        criterion = CRITERIA.get(badge.criteria_key)
        if criterion is None:
            continue

        try:
            if criterion(student):
                StudentBadge.objects.create(student=student, badge=badge)
                new_badges.append(badge.name)
        except Exception:
            pass  # never let badge checks break a game submission

    return new_badges
