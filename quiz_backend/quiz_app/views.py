from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Question, QuizSession
from .serializers import QuestionSerializer, QuizSessionSerializer
import random

class StartQuizView(APIView):
    def post(self, request):
        session = QuizSession.objects.create()
        return Response({'session_id': session.id}, status=status.HTTP_201_CREATED)

class GetQuestionView(APIView):
    def get(self, request, session_id):
        try:
            session = QuizSession.objects.get(id=session_id)
            asked_questions = session.questions_asked.all()
            remaining_questions = Question.objects.exclude(id__in=[q.id for q in asked_questions])

            if remaining_questions.exists():
                question = random.choice(remaining_questions)
                session.questions_asked.add(question)  
                session.save()
                serializer = QuestionSerializer(question)
                return Response(serializer.data)
            else:
                return Response({'message': 'No more questions available'}, status=status.HTTP_404_NOT_FOUND)
        except QuizSession.DoesNotExist:
            return Response({'error': 'Invalid session ID'}, status=status.HTTP_404_NOT_FOUND)


class SubmitAnswerView(APIView):
    def post(self, request, session_id):
        try:
            session = QuizSession.objects.get(id=session_id)
            question_id = request.data.get('question_id')
            selected_option = request.data.get('selected_option')
            question = Question.objects.get(id=question_id)

            if int(selected_option) == question.correct_option:
                session.correct_answers += 1
            else:
                session.incorrect_answers += 1

            session.total_questions += 1
            session.save()
            return Response({'message': 'Answer submitted successfully!'})
        except QuizSession.DoesNotExist:
            return Response({'error': 'Invalid session ID'}, status=status.HTTP_404_NOT_FOUND)

class GetResultsView(APIView):
    def get(self, request, session_id):
        try:
            session = QuizSession.objects.get(id=session_id)
            serializer = QuizSessionSerializer(session)
            return Response(serializer.data)
        except QuizSession.DoesNotExist:
            return Response({'error': 'Invalid session ID'}, status=status.HTTP_404_NOT_FOUND)

class GetTotalAnswerableQuestionsView(APIView):
    def get(self, request, session_id):
        try:
            session = QuizSession.objects.get(id=session_id)

            total_questions = Question.objects.count()

            answered_questions = session.total_questions

            answerable_questions = total_questions - answered_questions

            return Response({"total_answerable_questions": answerable_questions}, status=status.HTTP_200_OK)
        except QuizSession.DoesNotExist:
            return Response({"error": "Quiz session not found"}, status=status.HTTP_404_NOT_FOUND)