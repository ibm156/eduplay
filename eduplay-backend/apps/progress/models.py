from django.db import models
from django.conf import settings


class Badge(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    icon        = models.CharField(max_length=10, default='🏅')
    description = models.TextField()
    criteria_key = models.CharField(
        max_length=50,
        help_text='Internal key used by the badge-awarding service',
    )
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f'{self.icon} {self.name}'


class StudentBadge(models.Model):
    student   = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_badges'
    )
    badge     = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='awarded_to')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'badge']
        ordering        = ['-earned_at']

    def __str__(self):
        return f'{self.student.username} earned {self.badge.name}'
