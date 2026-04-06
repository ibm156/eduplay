from django.db import models


class Subject(models.Model):
    class GradeLevel(models.TextChoices):
        PRIMARY   = 'primary',   'Primary'
        SECONDARY = 'secondary', 'Secondary'
        BOTH      = 'both',      'Both'

    name        = models.CharField(max_length=100)
    icon        = models.CharField(max_length=10, default='📚')
    color       = models.CharField(max_length=20, default='#6C63FF')
    accent_color = models.CharField(max_length=20, default='#9B87FF')
    grade_level = models.CharField(max_length=10, choices=GradeLevel.choices, default=GradeLevel.PRIMARY)
    order       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f'{self.name} ({self.grade_level})'


class Topic(models.Model):
    subject     = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='topics')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'title']
        unique_together = ['subject', 'title']

    def __str__(self):
        return f'{self.subject.name} — {self.title}'

    @property
    def question_count(self):
        return self.questions.count()


class Question(models.Model):
    class QuestionType(models.TextChoices):
        MULTIPLE_CHOICE = 'multiple_choice', 'Multiple Choice'
        TRUE_FALSE      = 'true_false',      'True / False'

    topic       = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='questions')
    type        = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.MULTIPLE_CHOICE)
    text        = models.TextField()
    explanation = models.TextField(blank=True, help_text='Shown after answering')
    order       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'Q: {self.text[:60]}'


class Choice(models.Model):
    question   = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text       = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)
    order      = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{"✓" if self.is_correct else "✗"} {self.text[:40]}'


class Flashcard(models.Model):
    topic      = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='flashcards')
    term       = models.CharField(max_length=200)
    definition = models.TextField()
    category   = models.CharField(max_length=100, blank=True)
    order      = models.PositiveIntegerField(default=0)
    is_active  = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.term


class WordScramble(models.Model):
    topic     = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='scramble_words')
    word      = models.CharField(max_length=50)
    hint      = models.CharField(max_length=200)
    scrambled = models.CharField(max_length=50, blank=True, help_text='Auto-generated if left blank')
    order     = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def save(self, *args, **kwargs):
        if not self.scrambled:
            import random
            letters = list(self.word.upper())
            random.shuffle(letters)
            # Ensure scrambled is different from original
            while ''.join(letters) == self.word.upper() and len(letters) > 1:
                random.shuffle(letters)
            self.scrambled = ''.join(letters)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.word} → {self.scrambled}'


class MatchPair(models.Model):
    topic      = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='match_pairs')
    term       = models.CharField(max_length=200)
    definition = models.CharField(max_length=300)
    order      = models.PositiveIntegerField(default=0)
    is_active  = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.term} ↔ {self.definition[:40]}'
