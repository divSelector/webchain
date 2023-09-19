from django.db.models import Q
import json

from users.tasks import async_send_emails
from django.conf import settings
from users.utils import encrypt

def get_bad_words_query():

    bad_words = ['fag','nigg']

    bad_words_in_title = Q()
    bad_words_in_descrip = Q()

    for word in bad_words:
        bad_words_in_title |= Q(title__icontains=word)
        bad_words_in_descrip |= Q(description__icontains=word)

    return bad_words_in_title | bad_words_in_descrip


def send_email(from_email, recipients, message):
    backend = 'smtp' if 'Smtp' in settings.EMAIL_BACKEND else 'console'
    data = {
        "from_email": from_email,
        "recipients": recipients,
        "message": message
    }
    encrypted_message = encrypt(json.dumps(data).encode('utf-8'))
    async_send_emails.delay([encrypted_message], backend)
