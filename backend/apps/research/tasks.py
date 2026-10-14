"""Celery asynchronous task for multi-agent research pipeline."""

import logging
from typing import Any

from celery import shared_task  # type: ignore[import-untyped]

from .services import ResearchOrchestrationService

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=2)
def run_research_pipeline_task(self: Any, report_id: str) -> str:
    """Asynchronous worker task executing the multi-agent DAG."""
    logger.info(f"Starting research pipeline task for report {report_id}")
    try:
        ResearchOrchestrationService.execute_research_pipeline(report_id)
        return f"Research report {report_id} completed successfully."
    except Exception as exc:
        logger.error(f"Error in research pipeline task {report_id}: {exc}")
        raise self.retry(exc=exc, countdown=10) from exc
