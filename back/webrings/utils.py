from django.db.models import Q
import json

from users.tasks import async_send_emails
from django.conf import settings

def get_bad_words_query():

    BAD_WORDS = [
        'fag', 'f a g',
        'nigg', 'n1gg', 'n i g g'
    ]

    def generate_permutations(word):
        if not word:
            return ['']
        
        first_char = word[0]
        rest_chars = word[1:]
        
        permutations = []
        for p in generate_permutations(rest_chars):
            permutations.append(first_char.lower() + p)
            permutations.append(first_char.upper() + p)

        return permutations
        
    bad_words = [
        p for word in BAD_WORDS 
        for p in generate_permutations(word)
    ]

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
    async_send_emails.delay([json.dumps(data)], backend)
