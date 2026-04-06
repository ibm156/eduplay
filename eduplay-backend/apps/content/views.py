from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Subject, Topic, Question, Flashcard, WordScramble, MatchPair
from .serializers import (
    SubjectSerializer, TopicSerializer,
    QuestionSerializer, QuestionWriteSerializer,
    FlashcardSerializer, WordScrambleSerializer, MatchPairSerializer,
)
from apps.users.models import User


class IsTeacherOrAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role in ('teacher', 'admin')


# ─── Subjects ────────────────────────────────────────────────────────────────

class SubjectListView(generics.ListAPIView):
    """GET /api/subjects/ — list subjects filtered by school level."""
    serializer_class   = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user  = self.request.user
        level = self.request.query_params.get('level', user.school_level)
        qs    = Subject.objects.filter(is_active=True)
        if level and level != 'both':
            qs = qs.filter(grade_level__in=[level, 'both'])
        return qs

    def get_serializer_context(self):
        return {'request': self.request}


class SubjectDetailView(generics.RetrieveAPIView):
    queryset           = Subject.objects.filter(is_active=True)
    serializer_class   = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}


# ─── Topics ──────────────────────────────────────────────────────────────────

class TopicListView(generics.ListAPIView):
    """GET /api/subjects/<id>/topics/"""
    serializer_class   = TopicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Topic.objects.filter(
            subject_id=self.kwargs['subject_id'],
            is_active=True,
        ).prefetch_related('questions')

    def get_serializer_context(self):
        return {'request': self.request}


# ─── Questions ───────────────────────────────────────────────────────────────

class QuestionListView(generics.ListAPIView):
    """GET /api/topics/<id>/questions/ — returns up to 10 random questions."""
    serializer_class   = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Question.objects.filter(
            topic_id=self.kwargs['topic_id'],
            is_active=True,
        ).prefetch_related('choices').order_by('?')
        limit = int(self.request.query_params.get('limit', 10))
        return qs[:limit]


class QuestionWriteViewSet(viewsets.ModelViewSet):
    """Full CRUD for teacher/admin."""
    serializer_class   = QuestionWriteSerializer
    permission_classes = [IsTeacherOrAdmin]
    filter_backends    = [DjangoFilterBackend]
    filterset_fields   = ['topic', 'type', 'is_active']

    def get_queryset(self):
        return Question.objects.prefetch_related('choices').all()


# ─── Flashcards ──────────────────────────────────────────────────────────────

class FlashcardListView(generics.ListAPIView):
    """GET /api/topics/<id>/flashcards/"""
    serializer_class   = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Flashcard.objects.filter(
            topic_id=self.kwargs['topic_id'],
            is_active=True,
        ).order_by('?')


class FlashcardWriteViewSet(viewsets.ModelViewSet):
    serializer_class   = FlashcardSerializer
    permission_classes = [IsTeacherOrAdmin]
    filterset_fields   = ['topic']

    def get_queryset(self):
        return Flashcard.objects.all()


# ─── Word Scramble ────────────────────────────────────────────────────────────

class WordScrambleListView(generics.ListAPIView):
    """GET /api/topics/<id>/scramble/"""
    serializer_class   = WordScrambleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WordScramble.objects.filter(
            topic_id=self.kwargs['topic_id'],
            is_active=True,
        ).order_by('?')


class WordScrambleWriteViewSet(viewsets.ModelViewSet):
    serializer_class   = WordScrambleSerializer
    permission_classes = [IsTeacherOrAdmin]
    filterset_fields   = ['topic']

    def get_queryset(self):
        return WordScramble.objects.all()


# ─── Match Pairs ─────────────────────────────────────────────────────────────

class MatchPairListView(generics.ListAPIView):
    """GET /api/topics/<id>/match/"""
    serializer_class   = MatchPairSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MatchPair.objects.filter(
            topic_id=self.kwargs['topic_id'],
            is_active=True,
        ).order_by('?')


class MatchPairWriteViewSet(viewsets.ModelViewSet):
    serializer_class   = MatchPairSerializer
    permission_classes = [IsTeacherOrAdmin]
    filterset_fields   = ['topic']

    def get_queryset(self):
        return MatchPair.objects.all()
