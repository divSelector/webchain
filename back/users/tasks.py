from django.core.mail import get_connection

from core.celery import app

@app.task(rety_backoff=True, serializer="pickle")
def async_send_messages(email_messages):
    conn = get_connection(backend='anymail.backends.mailgun.EmailBackend')
    conn.send_messages(email_messages)