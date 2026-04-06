import pytest
from django.urls import reverse
from apps.content.models import Subject, Topic, Question, Choice, Flashcard


@pytest.fixture
def subject(db):
    return Subject.objects.create(
        name='Physics', icon='⚛️', color='#6C63FF',
        accent_color='#9B87FF', grade_level='secondary',
    )


@pytest.fixture
def topic(db, subject):
    return Topic.objects.create(
        subject=subject, title='Electromagnetism', order=1,
    )


@pytest.fixture
def question_with_choices(db, topic):
    q = Question.objects.create(
        topic=topic,
        type='multiple_choice',
        text='What is the SI unit of electric current?',
    )
    Choice.objects.create(question=q, text='Volt',   is_correct=False, order=0)
    Choice.objects.create(question=q, text='Ampere', is_correct=True,  order=1)
    Choice.objects.create(question=q, text='Ohm',    is_correct=False, order=2)
    Choice.objects.create(question=q, text='Watt',   is_correct=False, order=3)
    return q


@pytest.fixture
def flashcard(db, topic):
    return Flashcard.objects.create(
        topic=topic,
        term='Voltage',
        definition='Energy transferred per unit charge',
        category='PHYSICS',
    )


@pytest.mark.django_db
class TestSubjectList:
    def test_list_requires_auth(self, api_client):
        res = api_client.get(reverse('subject-list'))
        assert res.status_code == 401

    def test_list_returns_subjects(self, student_client, subject):
        res = student_client.get(reverse('subject-list'))
        assert res.status_code == 200
        assert len(res.data) >= 1
        names = [s['name'] for s in res.data]
        assert 'Physics' in names

    def test_list_includes_topic_count(self, student_client, subject, topic):
        res = student_client.get(reverse('subject-list'))
        assert res.status_code == 200
        phys = next(s for s in res.data if s['name'] == 'Physics')
        assert phys['topic_count'] == 1


@pytest.mark.django_db
class TestTopicList:
    def test_list_topics(self, student_client, subject, topic):
        url = reverse('topic-list', kwargs={'subject_id': subject.id})
        res = student_client.get(url)
        assert res.status_code == 200
        assert len(res.data) == 1
        assert res.data[0]['title'] == 'Electromagnetism'

    def test_empty_subject_returns_empty_list(self, student_client, subject):
        url = reverse('topic-list', kwargs={'subject_id': subject.id})
        res = student_client.get(url)
        assert res.status_code == 200
        assert res.data == []


@pytest.mark.django_db
class TestQuestionList:
    def test_questions_require_auth(self, api_client, topic):
        url = reverse('question-list', kwargs={'topic_id': topic.id})
        res = api_client.get(url)
        assert res.status_code == 401

    def test_list_questions(self, student_client, topic, question_with_choices):
        url = reverse('question-list', kwargs={'topic_id': topic.id})
        res = student_client.get(url)
        assert res.status_code == 200
        assert len(res.data) == 1
        q = res.data[0]
        assert q['text'] == 'What is the SI unit of electric current?'
        assert len(q['choices']) == 4

    def test_correct_choice_id_is_exposed(self, student_client, topic, question_with_choices):
        url = reverse('question-list', kwargs={'topic_id': topic.id})
        res = student_client.get(url)
        q = res.data[0]
        correct = next(c for c in q['choices'] if c['text'] == 'Ampere')
        assert q['correct_choice_id'] == correct['id']

    def test_teacher_can_create_question(self, teacher_client, topic):
        url = '/api/admin/questions/'
        payload = {
            'topic': topic.id,
            'type': 'multiple_choice',
            'text': 'New test question?',
            'choices': [
                {'text': 'A', 'is_correct': True,  'order': 0},
                {'text': 'B', 'is_correct': False, 'order': 1},
                {'text': 'C', 'is_correct': False, 'order': 2},
                {'text': 'D', 'is_correct': False, 'order': 3},
            ]
        }
        res = teacher_client.post(url, payload, format='json')
        assert res.status_code == 201
        assert res.data['text'] == 'New test question?'

    def test_student_cannot_create_question(self, student_client, topic):
        url = '/api/admin/questions/'
        res = student_client.post(url, {'topic': topic.id, 'text': 'Hack?'}, format='json')
        assert res.status_code == 403


@pytest.mark.django_db
class TestFlashcardList:
    def test_list_flashcards(self, student_client, topic, flashcard):
        url = reverse('flashcard-list', kwargs={'topic_id': topic.id})
        res = student_client.get(url)
        assert res.status_code == 200
        assert len(res.data) == 1
        assert res.data[0]['term'] == 'Voltage'
