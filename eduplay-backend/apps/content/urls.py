from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'admin/questions', views.QuestionWriteViewSet,   basename='question-admin')
router.register(r'admin/flashcards', views.FlashcardWriteViewSet, basename='flashcard-admin')
router.register(r'admin/scramble',  views.WordScrambleWriteViewSet, basename='scramble-admin')
router.register(r'admin/match',     views.MatchPairWriteViewSet,  basename='match-admin')

urlpatterns = [
    # Subjects
    path('subjects/',                          views.SubjectListView.as_view(),     name='subject-list'),
    path('subjects/<int:pk>/',                 views.SubjectDetailView.as_view(),   name='subject-detail'),
    path('subjects/<int:subject_id>/topics/',  views.TopicListView.as_view(),       name='topic-list'),

    # Topic content (student-facing, read-only)
    path('topics/<int:topic_id>/questions/',   views.QuestionListView.as_view(),    name='question-list'),
    path('topics/<int:topic_id>/flashcards/',  views.FlashcardListView.as_view(),   name='flashcard-list'),
    path('topics/<int:topic_id>/scramble/',    views.WordScrambleListView.as_view(), name='scramble-list'),
    path('topics/<int:topic_id>/match/',       views.MatchPairListView.as_view(),   name='match-list'),

    # Teacher/admin CRUD
    path('', include(router.urls)),
]
