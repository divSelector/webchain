from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError


def validate_date_not_in_future(value):
    if value > timezone.now():
        raise ValidationError("Date cannot be in the future.")
    

def validate_https_url(value):
    if not value.startswith('https://'):
        raise ValidationError("Please enter an HTTPS URL.")
    validator = URLValidator()
    try:
        validator(value)
    except ValidationError:
        raise ValidationError("Please enter a valid URL.")