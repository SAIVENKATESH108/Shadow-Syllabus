"""Root URL Configuration for Open Student Learning Platform."""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.users.urls")),
    path("api/v1/courses/", include("apps.courses.urls")),
    path("api/v1/assessments/", include("apps.assessments.urls")),
    path("api/v1/ai/", include("apps.ai_gateway.urls")),
    path("api/v1/research/", include("apps.research.urls")),
    path("api/v1/syllabus/", include("apps.syllabus.urls")),
]
