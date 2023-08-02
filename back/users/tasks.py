from django.core.mail import get_connection
from celery import shared_task

from django.conf import settings

@shared_task()
def async_send_emails(messages, backend):
    conn = get_connection(backend=settings.EMAIL_BACKEND)
    if not messages:
        return
    msg_count = 0
    with conn._lock:
        try:
            stream_created = conn.open()
            if backend == 'smtp':
                if not conn.connection or stream_created is None:
                    # We failed silently on open().
                    # Trying to send would be pointless.
                    return 0
            for message in messages:
                conn._send(message)
                msg_count += 1
            if stream_created:
                conn.close()
        except Exception:
            if not conn.fail_silently:
                raise
    return msg_count