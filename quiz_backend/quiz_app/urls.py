from django.urls import path
from .views import StartQuizView, GetQuestionView, SubmitAnswerView, GetResultsView, GetTotalAnswerableQuestionsView

urlpatterns = [
    path('start-quiz/', StartQuizView.as_view(), name='start-quiz'),
    path('get-question/<int:session_id>/', GetQuestionView.as_view(), name='get-question'),
    path('submit-answer/<int:session_id>/', SubmitAnswerView.as_view(), name='submit-answer'),
    path('get-results/<int:session_id>/', GetResultsView.as_view(), name='get-results'),
    path('get-remaining-questions/<int:session_id>/', GetTotalAnswerableQuestionsView.as_view(), name='get-remaining-questions'),
]
