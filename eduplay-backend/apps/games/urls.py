from django.urls import path
from . import views

urlpatterns = [
    path('sessions/',      views.GameSessionCreateView.as_view(), name='session-create'),
    path('sessions/my/',   views.MyGameHistoryView.as_view(),     name='session-my'),
    path('leaderboard/',   views.leaderboard_view,                name='leaderboard'),
]
