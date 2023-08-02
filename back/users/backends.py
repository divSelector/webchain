from django.core.mail.backends.smtp import EmailBackend

from .tasks import async_send_messages

class AsyncSmtpEmailBackend(EmailBackend):

