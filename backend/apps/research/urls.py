"""Research URL routing."""

from rest_framework.routers import DefaultRouter

from .views import ResearchReportViewSet

router = DefaultRouter()
router.register(r"reports", ResearchReportViewSet, basename="research-report")

urlpatterns = router.urls
