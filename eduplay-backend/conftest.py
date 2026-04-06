import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def student_user(db):
    return User.objects.create_user(
        username='test_student',
        password='testpass123',
        first_name='Test',
        last_name='Student',
        role='student',
        school_level='secondary',
        year_group='Year 9',
    )


@pytest.fixture
def teacher_user(db):
    return User.objects.create_user(
        username='test_teacher',
        password='testpass123',
        first_name='Test',
        last_name='Teacher',
        role='teacher',
        school_level='secondary',
    )


@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(
        username='test_admin',
        password='testpass123',
        email='admin@test.com',
        role='admin',
    )


@pytest.fixture
def student_client(api_client, student_user):
    """API client authenticated as a student."""
    refresh = RefreshToken.for_user(student_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def teacher_client(api_client, teacher_user):
    """API client authenticated as a teacher."""
    refresh = RefreshToken.for_user(teacher_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client
