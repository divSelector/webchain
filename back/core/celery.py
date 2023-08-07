import os
from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

celery_app = Celery("core")
celery_app.conf.beat_schedule = {
    'cleanup-expired-tokens': {
        'task': 'users.tasks.cleanup_expired_tokens',
        'schedule': settings.TOKEN_EXPIRE_TIME, 
    },
}

celery_app.config_from_object("django.conf:settings", namespace="CELERY")
celery_app.autodiscover_tasks()