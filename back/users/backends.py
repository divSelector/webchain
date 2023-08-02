from django.core.mail.backends.smtp import EmailBackend as SmtpEmailBackend
from django.core.mail.backends.console import EmailBackend as ConsoleEmailBackend
from django.core.mail.message import sanitize_address
import smtplib
import json
from django.conf import settings

from .tasks import async_send_emails
from .utils import encrypt, decrypt


class EncryptedSmtpEmailBackend(SmtpEmailBackend):
    
    def serialize_message(self, email_message):
        if not email_message.recipients():
            return False
        encoding = email_message.encoding or settings.DEFAULT_CHARSET
        from_email = sanitize_address(email_message.from_email, encoding)
        recipients = [
            sanitize_address(addr, encoding) for addr in email_message.recipients()
        ]
        msg = email_message.message()
        msg_data = msg.as_bytes(linesep="\r\n")
        charset = (
            msg.get_charset().get_output_charset() if msg.get_charset() else "utf-8"
        )
        msg_data = msg_data.decode(charset)
        serialized_data = {
            "from_email": from_email,
            "recipients": recipients,
            "message": msg_data,
        }
        return encrypt(json.dumps(serialized_data).encode('utf-8'))


    def send_messages(self, email_messages):
        msgs = [self.serialize_message(msg) for msg in email_messages]
        async_send_emails.delay(msgs, str(self))
        return len(email_messages)
    

    def _send(self, encrypted_message):
        decrypted_message = decrypt(encrypted_message)
        email_message = json.loads(decrypted_message.decode('utf-8'))
        from_email = email_message['from_email']
        recipients = email_message['recipients']
        message = email_message['message']
        try:
            self.connection.sendmail(
                from_email, recipients, message
            )
        except smtplib.SMTPException:
            if not self.fail_silently:
                raise
            return False
        return True
    
    def __str__(self):
        return "smtp"


class EncryptedConsoleEmailBackend(ConsoleEmailBackend):

    def serialize_message(self, message):
        msg = message.message()
        msg_data = msg.as_bytes()
        charset = (
            msg.get_charset().get_output_charset() if msg.get_charset() else "utf-8"
        )
        msg_data = msg_data.decode(charset)
        return encrypt(msg_data.encode('utf-8'))
    
    def _send(self, encrypted_message):
        message = decrypt(encrypted_message).decode('utf-8')
        self.write_message(message)
        self.stream.flush()

    def write_message(self, msg_data):
        self.stream.write("%s\n" % msg_data)
        self.stream.write("-" * 79)
        self.stream.write("\n")

    def send_messages(self, email_messages):
        msgs = [self.serialize_message(msg) for msg in email_messages]
        async_send_emails.delay(msgs, str(self))
        return len(email_messages)
    
    def __str__(self):
        return "console"
    