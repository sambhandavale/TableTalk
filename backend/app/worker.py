import asyncio
from celery import Celery
import os
import logging
import sys

logger = logging.getLogger(__name__)

# Basic celery instance
celery_app = Celery(
    "tabletalk_worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # Configure beat tasks
    beat_schedule={
        "process_campaigns_every_minute": {
            "task": "app.tasks.run_campaign_sweep",
            "schedule": 60.0,
        },
    }
)

# Autodiscover tasks from the app
celery_app.autodiscover_tasks(["app"], related_name="tasks")
