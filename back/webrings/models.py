from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator

from .validators import validate_date_not_in_future
from django.core.exceptions import ValidationError

User = get_user_model()


class Account(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('free', 'Free'),
        ('subscriber', 'Subscriber'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=36)
    account_type = models.CharField(max_length=12, choices=ACCOUNT_TYPE_CHOICES, default='free')
    date_updated = models.DateTimeField(auto_now=True,  validators=[validate_date_not_in_future])
    
    def __str__(self):
        return self.user.email
    
    def __repr__(self):
        return f"Account: {self.user.email}, account_type={self.account_type}"
    
    
class Webring(models.Model):
    account = models.ForeignKey("Account", on_delete=models.CASCADE, related_name='account_from_webring', related_query_name='account')
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    date_created = models.DateTimeField(auto_now_add=True, validators=[validate_date_not_in_future])
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    automatic_approval = models.BooleanField(default=False)
    primary = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Webring(id={self.id}, account={self.account}, title='{self.title}', date_created='{self.date_created}', " + \
               f"date_updated='{self.date_updated}', primary='{self.primary}')"


class Page(models.Model):
    account = models.ForeignKey("Account", on_delete=models.CASCADE, related_name='account_from_page', related_query_name='account')
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    url = models.URLField(validators=[URLValidator()])
    date_created = models.DateTimeField(auto_now_add=True, validators=[validate_date_not_in_future])
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    webrings = models.ManyToManyField('Webring', related_name='pages', related_query_name='page', blank=True)
    primary = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Page(id={self.id}, account={self.account}, title='{self.title}', url='{self.url}', date_created='{self.date_created}', primary='{self.primary}')"
