from django.db import models
from django.conf import settings


class GameSession(models.Model):
    class GameType(models.TextChoices):
        QUIZ      = 'quiz',      'Quiz Blitz'
        FLASHCARD = 'flashcard', 'Flashcard Flip'
        SCRAMBLE  = 'scramble',  'Word Scramble'
        MATCH     = 'match',     'Match It'

    student      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='game_sessions')
    topic        = models.ForeignKey('content.Topic', on_delete=models.SET_NULL, null=True, related_name='sessions')
    game_type    = models.CharField(max_length=20, choices=GameType.choices)
    score        = models.PositiveIntegerField(default=0)
    total        = models.PositiveIntegerField(default=0)
    xp_earned    = models.PositiveIntegerField(default=0)
    duration_seconds = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f'{self.student.username} — {self.game_type} ({self.score}/{self.total})'

    @property
    def accuracy_percent(self):
        return round((self.score / self.total) * 100) if self.total else 0
