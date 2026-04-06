from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        TEACHER = 'teacher', 'Teacher'
        ADMIN   = 'admin',   'Admin'

    class SchoolLevel(models.TextChoices):
        PRIMARY   = 'primary',   'Primary'
        SECONDARY = 'secondary', 'Secondary'

    role         = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    school_level = models.CharField(max_length=10, choices=SchoolLevel.choices, default=SchoolLevel.PRIMARY)
    year_group   = models.CharField(max_length=20, blank=True)
    avatar       = models.CharField(max_length=10, default='🐸')
    xp           = models.PositiveIntegerField(default=0)
    level        = models.PositiveIntegerField(default=1)
    streak       = models.PositiveIntegerField(default=0)
    last_played  = models.DateField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-xp']

    def __str__(self):
        return f'{self.username} ({self.role})'

    def add_xp(self, amount: int) -> None:
        """Add XP and recalculate level (every 500 XP = 1 level)."""
        self.xp += amount
        self.level = (self.xp // 500) + 1
        self.save(update_fields=['xp', 'level'])

    def update_streak(self) -> None:
        """Call after each game session to maintain daily streak."""
        from django.utils import timezone
        today = timezone.now().date()
        if self.last_played is None:
            self.streak = 1
        elif self.last_played == today:
            return  # already played today
        elif (today - self.last_played).days == 1:
            self.streak += 1
        else:
            self.streak = 1
        self.last_played = today
        self.save(update_fields=['streak', 'last_played'])
