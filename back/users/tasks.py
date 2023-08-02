from django.core.mail import get_connection
from celery import shared_task

from django.conf import settings

@shared_task()
def async_write_messages_to_console(email_messages):
    conn = get_connection(backend=settings.EMAIL_BACKEND)
    if not email_messages:
        return
    msg_count = 0
    with conn._lock:
        try:
            stream_created = conn.open()
            for message in email_messages:
                conn.write_message(message)
                conn.stream.flush()  # flush after each message
                msg_count += 1
            if stream_created:
                conn.close()
        except Exception:
            if not conn.fail_silently:
                raise
    return msg_count


@shared_task()
def async_send_messages_with_smtp(email_messages):
    conn = get_connection(backend=settings.EMAIL_BACKEND)
    if not email_messages:
        return 0
    with conn._lock:
        new_conn_created = conn.open()
        if not conn.connection or new_conn_created is None:
            # We failed silently on open().
            # Trying to send would be pointless.
            return 0
        num_sent = 0
        for message in email_messages:
            sent = conn._send(message)
            if sent:
                num_sent += 1
        if new_conn_created:
            conn.close()
    return num_sent
