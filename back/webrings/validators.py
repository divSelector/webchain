from django.core.exceptions import ValidationError
from django.utils import timezone


def validate_date_not_in_future(value):
    if value > timezone.now():
        raise ValidationError("Date cannot be in the future.")