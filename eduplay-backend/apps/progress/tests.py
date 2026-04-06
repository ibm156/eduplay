import pytest
from django.urls import reverse
from apps.progress.models import Badge, StudentBadge
from apps.progress.services import check_and_award_badges


@pytest.fixture
def badges(db):
    Badge.objects.create(name='First Game', icon='🎯', description='Complete first game', criteria_key='first_game')
    Badge.objects.create(name='XP 500',     icon='⭐', description='Earn 500 XP',         criteria_key='xp_500')
    Badge.objects.create(name='Streak 5',   icon='🔥', description='5-day streak',        criteria_key='streak_5')
    return Badge.objects.all()


@pytest.mark.django_db
class TestBadgeAwarding:
    def test_first_game_badge(self, student_user, badges, topic_fixture):
        from apps.games.models import GameSession
        from apps.content.models import Subject, Topic
        subject = Subject.objects.create(name='Test', icon='📚', color='#fff', accent_color='#fff', grade_level='secondary')
        topic = Topic.objects.create(subject=subject, title='Test Topic', order=1)
        GameSession.objects.create(
            student=student_user, topic=topic,
            game_type='quiz', score=5, total=10, xp_earned=30, duration_seconds=60,
        )
        new_badges = check_and_award_badges(student_user)
        assert 'First Game' in new_badges

    def test_xp_badge_awarded_at_threshold(self, student_user, badges):
        student_user.xp = 600
        student_user.save()
        new_badges = check_and_award_badges(student_user)
        assert 'XP 500' in new_badges

    def test_badge_not_awarded_twice(self, student_user, badges):
        student_user.xp = 600
        student_user.save()
        check_and_award_badges(student_user)
        new_badges = check_and_award_badges(student_user)
        assert 'XP 500' not in new_badges

    def test_streak_badge(self, student_user, badges):
        student_user.streak = 7
        student_user.save()
        new_badges = check_and_award_badges(student_user)
        assert 'Streak 5' in new_badges


@pytest.mark.django_db
class TestBadgeEndpoints:
    def test_my_badges_empty(self, student_client):
        url = reverse('my-badges')
        res = student_client.get(url)
        assert res.status_code == 200
        assert res.data == []

    def test_my_badges_after_earning(self, student_client, student_user, badges):
        student_user.xp = 600
        student_user.save()
        check_and_award_badges(student_user)
        url = reverse('my-badges')
        res = student_client.get(url)
        assert res.status_code == 200
        assert len(res.data) >= 1
        badge_names = [b['name'] for b in res.data]
        assert 'XP 500' in badge_names

    def test_all_badges_list(self, student_client, badges):
        url = reverse('badge-list')
        res = student_client.get(url)
        assert res.status_code == 200
        assert len(res.data) == 3


@pytest.mark.django_db
class TestStatsEndpoint:
    def test_stats_returns_correct_structure(self, student_client):
        url = reverse('my-stats')
        res = student_client.get(url)
        assert res.status_code == 200
        assert 'xp' in res.data
        assert 'level' in res.data
        assert 'streak' in res.data
        assert 'total_games' in res.data
        assert 'avg_accuracy' in res.data
        assert 'by_game_type' in res.data

    def test_stats_initial_values(self, student_client, student_user):
        url = reverse('my-stats')
        res = student_client.get(url)
        assert res.data['total_games'] == 0
        assert res.data['avg_accuracy'] == 0
        assert res.data['xp'] == student_user.xp
