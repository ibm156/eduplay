import pytest
from django.urls import reverse
from apps.content.models import Subject, Topic
from apps.games.models import GameSession


@pytest.fixture
def subject(db):
    return Subject.objects.create(
        name='Maths', icon='📐', color='#00D4AA',
        accent_color='#5EEAD4', grade_level='secondary',
    )


@pytest.fixture
def topic(db, subject):
    return Topic.objects.create(subject=subject, title='Algebra', order=1)


@pytest.fixture
def game_session(db, student_user, topic):
    return GameSession.objects.create(
        student=student_user,
        topic=topic,
        game_type='quiz',
        score=8,
        total=10,
        xp_earned=50,
        duration_seconds=120,
    )


@pytest.mark.django_db
class TestGameSessionSubmit:
    def test_submit_requires_auth(self, api_client, topic):
        url = reverse('session-create')
        res = api_client.post(url, {
            'game_type': 'quiz', 'topic_id': topic.id,
            'score': 5, 'total': 10, 'xp_earned': 30, 'duration_seconds': 90,
        })
        assert res.status_code == 401

    def test_submit_valid_session(self, student_client, student_user, topic):
        url = reverse('session-create')
        initial_xp = student_user.xp
        res = student_client.post(url, {
            'game_type': 'quiz',
            'topic_id': topic.id,
            'score': 8,
            'total': 10,
            'xp_earned': 50,
            'duration_seconds': 120,
        }, format='json')
        assert res.status_code == 201
        assert 'session' in res.data
        assert res.data['session']['score'] == 8
        assert res.data['session']['total'] == 10
        # XP should be updated on the user
        student_user.refresh_from_db()
        assert student_user.xp == initial_xp + 50

    def test_score_cannot_exceed_total(self, student_client, topic):
        url = reverse('session-create')
        res = student_client.post(url, {
            'game_type': 'quiz', 'topic_id': topic.id,
            'score': 15, 'total': 10, 'xp_earned': 50, 'duration_seconds': 60,
        }, format='json')
        assert res.status_code == 400

    def test_submit_updates_streak(self, student_client, student_user, topic):
        url = reverse('session-create')
        student_client.post(url, {
            'game_type': 'flashcard', 'topic_id': topic.id,
            'score': 5, 'total': 5, 'xp_earned': 30, 'duration_seconds': 60,
        }, format='json')
        student_user.refresh_from_db()
        assert student_user.streak >= 1

    def test_all_game_types_accepted(self, student_client, topic):
        url = reverse('session-create')
        for gt in ['quiz', 'flashcard', 'scramble', 'match']:
            res = student_client.post(url, {
                'game_type': gt, 'topic_id': topic.id,
                'score': 3, 'total': 5, 'xp_earned': 20, 'duration_seconds': 60,
            }, format='json')
            assert res.status_code == 201, f'Failed for game_type={gt}'


@pytest.mark.django_db
class TestGameHistory:
    def test_my_history(self, student_client, game_session):
        url = reverse('session-my')
        res = student_client.get(url)
        assert res.status_code == 200
        assert len(res.data) >= 1

    def test_only_own_sessions_returned(self, student_client, teacher_user, topic, db):
        # Create a session for a different user
        GameSession.objects.create(
            student=teacher_user, topic=topic,
            game_type='quiz', score=5, total=10, xp_earned=25, duration_seconds=60,
        )
        url = reverse('session-my')
        res = student_client.get(url)
        usernames = [s.get('student_username') for s in res.data]
        # Should not contain teacher's sessions
        assert all(u != 'test_teacher' for u in usernames if u)


@pytest.mark.django_db
class TestLeaderboard:
    def test_leaderboard_returns_list(self, student_client, student_user):
        url = reverse('leaderboard')
        res = student_client.get(url)
        assert res.status_code == 200
        assert isinstance(res.data, list)

    def test_leaderboard_marks_current_user(self, student_client, student_user):
        url = reverse('leaderboard')
        res = student_client.get(url)
        current = [e for e in res.data if e.get('is_current_user')]
        assert len(current) == 1
        assert current[0]['username'] == 'test_student'

    def test_leaderboard_sorted_by_xp(self, student_client, student_user, db):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        User.objects.create_user(
            username='high_xp', password='pass', role='student',
            school_level='secondary', xp=9999,
        )
        url = reverse('leaderboard')
        res = student_client.get(url)
        xp_values = [e['xp'] for e in res.data]
        assert xp_values == sorted(xp_values, reverse=True)
