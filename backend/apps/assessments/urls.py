"""Assessment URL routing."""
from rest_framework.routers import DefaultRouter
from .views import AssignmentViewSet, FeedbackViewSet, SubmissionViewSet

router = DefaultRouter()
router.register(r"assignments", AssignmentViewSet, basename="assignment")
router.register(r"submissions", SubmissionViewSet, basename="submission")
router.register(r"feedback", FeedbackViewSet, basename="feedback")

urlpatterns = router.urls
