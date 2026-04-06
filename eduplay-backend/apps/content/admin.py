from django.contrib import admin
from .models import Subject, Topic, Question, Choice, Flashcard, WordScramble, MatchPair


class ChoiceInline(admin.TabularInline):
    model  = Choice
    extra  = 4
    fields = ['text', 'is_correct', 'order']


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display  = ['name', 'icon', 'grade_level', 'order', 'is_active']
    list_filter   = ['grade_level', 'is_active']
    search_fields = ['name']
    list_editable = ['order', 'is_active']


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display  = ['title', 'subject', 'order', 'is_active']
    list_filter   = ['subject', 'is_active']
    search_fields = ['title', 'subject__name']
    list_editable = ['order', 'is_active']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display  = ['text', 'topic', 'type', 'is_active']
    list_filter   = ['type', 'is_active', 'topic__subject']
    search_fields = ['text', 'topic__title']
    inlines       = [ChoiceInline]


@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display  = ['term', 'topic', 'category', 'order']
    list_filter   = ['topic__subject']
    search_fields = ['term', 'definition']


@admin.register(WordScramble)
class WordScrambleAdmin(admin.ModelAdmin):
    list_display  = ['word', 'scrambled', 'hint', 'topic']
    list_filter   = ['topic__subject']
    search_fields = ['word', 'hint']


@admin.register(MatchPair)
class MatchPairAdmin(admin.ModelAdmin):
    list_display  = ['term', 'definition', 'topic']
    list_filter   = ['topic__subject']
    search_fields = ['term', 'definition']
