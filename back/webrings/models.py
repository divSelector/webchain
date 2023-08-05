from django.db import models
from django.contrib.auth import get_user_model

from .validators import validate_date_not_in_future, validate_https_url
from django.core.exceptions import ValidationError

User = get_user_model()


class Account(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('free', 'Free'),
        ('subscriber', 'Subscriber'),
    ]
    
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=36, blank=False, null=False, unique=True)
    account_type = models.CharField(max_length=12, choices=ACCOUNT_TYPE_CHOICES, default='free')
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True, null=True, unique=True, default=None)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True, unique=True, default=None)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True, unique=True, default=None)

    def clean(self):
        validate_date_not_in_future(self.date_updated)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.user.email
    
    def __repr__(self):
        return f"Account: {self.user.email}, account_type={self.account_type}"
    
    
class Webring(models.Model):
    account = models.ForeignKey("Account", on_delete=models.CASCADE, related_name='webrings', related_query_name='webrings')
    title = models.CharField(max_length=42)
    description = models.TextField(max_length=500)
    date_created = models.DateTimeField(auto_now_add=True, validators=[validate_date_not_in_future])
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    automatic_approval = models.BooleanField(default=False)
    primary = models.BooleanField(default=False)

    def clean(self):
        for date in [self.date_updated, self.date_created]:
            validate_date_not_in_future(date)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Webring(id={self.id}, account={self.account}, title='{self.title}', date_created='{self.date_created}', " + \
               f"date_updated='{self.date_updated}', primary='{self.primary}')"


class Page(models.Model):
    account = models.ForeignKey("Account", on_delete=models.CASCADE, related_name='account', related_query_name='account')
    title = models.CharField(max_length=42)
    description = models.TextField(max_length=500)
    url = models.URLField(validators=[validate_https_url])
    date_created = models.DateTimeField(auto_now_add=True, validators=[validate_date_not_in_future])
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    webrings = models.ManyToManyField('Webring', related_name='page_links', through="WebringPageLink", related_query_name='page_links', blank=True)
    primary = models.BooleanField(default=False)

    def clean(self):
        validate_https_url(self.url)
        for date in [self.date_updated, self.date_created]:
            validate_date_not_in_future(date)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Page(id={self.id}, account={self.account}, title='{self.title}', url='{self.url}', date_created='{self.date_created}', primary='{self.primary}')"


class WebringPageLink(models.Model):
    page = models.ForeignKey('Page', on_delete=models.CASCADE, blank=False, null=False)
    webring = models.ForeignKey('Webring', on_delete=models.CASCADE, blank=False, null=False)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Page: {self.page.title} - WebRing: {self.webring.title}"
    
    def save(self, *args, **kwargs):
        if self.pk is None:  # New instance
            existing_link = WebringPageLink.objects.filter(page=self.page, webring=self.webring).exists()
            if existing_link:
                raise ValidationError("A link between this page and webring already exists.")

        super().save(*args, **kwargs)