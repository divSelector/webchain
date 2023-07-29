from django.db.models import Q

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
