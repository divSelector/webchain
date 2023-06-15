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
    type = models.CharField(max_length=12, choices=ACCOUNT_TYPE_CHOICES, default='free')
    date_updated = models.DateTimeField(auto_now=True,  validators=[validate_date_not_in_future])
    
    def __str__(self):
        return self.user.email
    
    def __repr__(self):
        return f"Account: {self.user.email}, type={self.type}"
    
    
class Webring(models.Model):
    account = models.ForeignKey("Account", on_delete=models.CASCADE, related_name='webrings_from_account')
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, validators=[validate_date_not_in_future])
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    automatic_approval = models.BooleanField(default=False)
    pages = models.ManyToManyField('Page', related_name='webrings_from_page', blank=True, through='WebringPageLink', symmetrical=False)
    primary = models.BooleanField(default=False)

    def save(self, *args, **kwargs):

        if not Webring.objects.filter(account=self.account, primary=True).exists():
            self.primary = True
        
        if self.primary:
            # Mark all other pages of the same account as not primary
            Webring.objects.filter(account=self.account).exclude(id=self.id).update(primary=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Webring(id={self.id}, account={self.account}, title='{self.title}', date_created='{self.date_created}', " + \
               f"date_updated='{self.date_updated}', primary='{self.primary}')"


class Page(models.Model):
    account = models.ForeignKey("Account", on_delete=models.CASCADE, related_name='pages_from_account')
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500, null=True, blank=True)
    url = models.URLField(validators=[URLValidator()])
    date_created = models.DateTimeField(auto_now_add=True, validators=[validate_date_not_in_future])
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    webrings = models.ManyToManyField('Webring', related_name='pages_from_webrings', blank=True, through='WebringPageLink')
    primary = models.BooleanField(default=False)

    def save(self, *args, **kwargs):

        if not Page.objects.filter(account=self.account, primary=True).exists():
            self.primary = True
        
        if self.primary:
            # Mark all other pages of the same account as not primary
            Page.objects.filter(account=self.account).exclude(id=self.id).update(primary=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Page(id={self.id}, account={self.account}, title='{self.title}', url='{self.url}', date_created='{self.date_created}', primary='{self.primary}')"


class WebringPageLink(models.Model):
    webring = models.ForeignKey('Webring', on_delete=models.CASCADE, related_name='webring_page_links_from_webring')
    page = models.ForeignKey('Page', on_delete=models.CASCADE, related_name='webring_page_links_from_page')
    approved = models.BooleanField()

    def save(self, *args, **kwargs):
        if not self.pk:  # Only set 'approved' if it's a new instance
            self.approved = self.webring.automatic_approval
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Webring: {self.webring.title} - Page: {self.page.title}"