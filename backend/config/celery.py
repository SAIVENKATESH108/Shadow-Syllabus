"""Celery application configuration for asynchronous background tasks."""
import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

app = Celery("learning_platform")

# Read configuration from Django settings with CELERY_ prefix
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks across all installed Django apps
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self: Celery) -> None:
    """Diagnostic task for verifying Celery worker health."""
    print(f"Request: {self.request!r}")
