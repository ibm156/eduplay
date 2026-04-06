import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, student_user):
        url = reverse('token_obtain_pair')
        res = api_client.post(url, {'username': 'test_student', 'password': 'testpass123'})
        assert res.status_code == 200
        assert 'access' in res.data
        assert 'refresh' in res.data
        assert 'user' in res.data

    def test_login_wrong_password(self, api_client, student_user):
        url = reverse('token_obtain_pair')
        res = api_client.post(url, {'username': 'test_student', 'password': 'wrong'})
        assert res.status_code == 401

    def test_login_unknown_user(self, api_client):
        url = reverse('token_obtain_pair')
        res = api_client.post(url, {'username': 'nobody', 'password': 'pass'})
        assert res.status_code == 401


@pytest.mark.django_db
class TestMeEndpoint:
    def test_get_me_authenticated(self, student_client, student_user):
        url = reverse('me')
        res = student_client.get(url)
        assert res.status_code == 200
        assert res.data['username'] == 'test_student'
        assert res.data['role'] == 'student'

    def test_get_me_unauthenticated(self, api_client):
        url = reverse('me')
        res = api_client.get(url)
        assert res.status_code == 401

    def test_patch_me(self, student_client):
        url = reverse('me')
        res = student_client.patch(url, {'first_name': 'Updated'})
        assert res.status_code == 200
        assert res.data['first_name'] == 'Updated'


@pytest.mark.django_db
class TestUserModel:
    def test_add_xp(self, student_user):
        student_user.add_xp(300)
        assert student_user.xp == 300
        assert student_user.level == 1

    def test_level_up(self, student_user):
        student_user.add_xp(600)
        assert student_user.xp == 600
        assert student_user.level == 2

    def test_streak_first_play(self, student_user):
        student_user.update_streak()
        assert student_user.streak == 1

    def test_streak_consecutive_days(self, student_user):
        from django.utils import timezone
        import datetime
        student_user.last_played = timezone.now().date() - datetime.timedelta(days=1)
        student_user.streak = 3
        student_user.save()
        student_user.update_streak()
        assert student_user.streak == 4

    def test_streak_resets_after_gap(self, student_user):
        from django.utils import timezone
        import datetime
        student_user.last_played = timezone.now().date() - datetime.timedelta(days=3)
        student_user.streak = 10
        student_user.save()
        student_user.update_streak()
        assert student_user.streak == 1
