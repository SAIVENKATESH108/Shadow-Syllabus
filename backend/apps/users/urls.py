"""User application URL routing."""
from django.urls import path
from .views import CurrentUserView, RegisterView, RequestDataErasureView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="user-register"),
    path("me/", CurrentUserView.as_view(), name="user-me"),
    path("erasure-request/", RequestDataErasureView.as_view(), name="user-erasure-request"),
]
