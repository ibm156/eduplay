from rest_framework import serializers
from .models import Subject, Topic, Question, Choice, Flashcard, WordScramble, MatchPair


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Choice
        fields = ['id', 'text', 'order']
        # NOTE: is_correct is intentionally excluded from student-facing serializer


class ChoiceWithAnswerSerializer(serializers.ModelSerializer):
    """Used in teacher/admin views — exposes correct answer."""
    class Meta:
        model  = Choice
        fields = ['id', 'text', 'is_correct', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    choices           = ChoiceSerializer(many=True, read_only=True)
    correct_choice_id = serializers.SerializerMethodField()

    class Meta:
        model  = Question
        fields = ['id', 'topic_id', 'type', 'text', 'choices', 'correct_choice_id']

    def get_correct_choice_id(self, obj):
        correct = obj.choices.filter(is_correct=True).first()
        return correct.id if correct else None


class QuestionWriteSerializer(serializers.ModelSerializer):
    """For creating/editing questions with choices."""
    choices = ChoiceWithAnswerSerializer(many=True)

    class Meta:
        model  = Question
        fields = ['id', 'topic', 'type', 'text', 'explanation', 'order', 'choices']

    def create(self, validated_data):
        choices_data = validated_data.pop('choices')
        question = Question.objects.create(**validated_data)
        for c in choices_data:
            Choice.objects.create(question=question, **c)
        return question

    def update(self, instance, validated_data):
        choices_data = validated_data.pop('choices', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if choices_data is not None:
            instance.choices.all().delete()
            for c in choices_data:
                Choice.objects.create(question=instance, **c)
        return instance


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Flashcard
        fields = ['id', 'topic_id', 'term', 'definition', 'category', 'order']


class WordScrambleSerializer(serializers.ModelSerializer):
    class Meta:
        model  = WordScramble
        fields = ['id', 'topic_id', 'word', 'hint', 'scrambled', 'order']


class MatchPairSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MatchPair
        fields = ['id', 'topic_id', 'term', 'definition', 'order']


class TopicSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(read_only=True)
    is_completed   = serializers.SerializerMethodField()

    class Meta:
        model  = Topic
        fields = ['id', 'subject_id', 'title', 'description', 'order', 'question_count', 'is_completed']

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        from apps.games.models import GameSession
        return GameSession.objects.filter(
            student=request.user,
            topic=obj,
            score__gte=obj.question_count * 0.6,
        ).exists()


class SubjectSerializer(serializers.ModelSerializer):
    topic_count     = serializers.IntegerField(source='topics.count', read_only=True)
    question_count  = serializers.SerializerMethodField()
    progress_percent = serializers.SerializerMethodField()

    class Meta:
        model  = Subject
        fields = [
            'id', 'name', 'icon', 'color', 'accent_color', 'grade_level',
            'topic_count', 'question_count', 'progress_percent',
        ]

    def get_question_count(self, obj):
        return sum(t.questions.count() for t in obj.topics.filter(is_active=True))

    def get_progress_percent(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        from apps.games.models import GameSession
        total   = obj.topics.filter(is_active=True).count()
        if total == 0:
            return 0
        completed = 0
        for topic in obj.topics.filter(is_active=True):
            if GameSession.objects.filter(student=request.user, topic=topic).exists():
                completed += 1
        return round((completed / total) * 100)
