from rest_framework import serializers
from .models import Question, QuizSession

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option1', 'option2', 'option3', 'option4']

class QuizSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizSession
        fields = '__all__'
