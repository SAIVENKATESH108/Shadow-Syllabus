"""AI Gateway URL configuration."""
from django.urls import path
from .views import AIStudyCoachView

urlpatterns = [
    path("coach/", AIStudyCoachView.as_view(), name="ai-coach"),
]
