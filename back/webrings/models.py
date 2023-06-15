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
    account_type = models.CharField(max_length=12, choices=ACCOUNT_TYPE_CHOICES, default='free')
    
    def __str__(self):
        return self.user.email
    
    def __repr__(self):
        return f"Account: {self.user.email}, type={self.account_type}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_updated = models.DateTimeField(auto_now=True,  validators=[validate_date_not_in_future])

    def __str__(self):
        return self.user.email
    
    def __repr__(self):
        return f"Profile: {self.user.email}"
    
class Webring(models.Model):
    MAX_FREE_WEBRINGS = 1

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='webrings_from_profile')
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, validators=[validate_date_not_in_future])
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    automatic_approval = models.BooleanField(default=False)
    pages = models.ManyToManyField('Page', related_name='webrings_from_page', blank=True, through='WebringPageLink', symmetrical=False)
    primary = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.profile.user.account.account_type == 'free':
            page_count = Webring.objects.filter(profile=self.profile).count()
            if page_count >= Webring.MAX_FREE_WEBRINGS:
                raise ValidationError(f"Free accounts are limited to {Webring.MAX_FREE_WEBRINGS} Webrings.")
            
        # If there are no other primary pages, mark this page as primary
        if not Webring.objects.filter(profile=self.profile, primary=True).exists():
            self.primary = True
        
        if self.primary:
            # Mark all other pages of the same profile as not primary
            Webring.objects.filter(profile=self.profile).exclude(id=self.id).update(primary=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Webring(id={self.id}, profile={self.profile}, title='{self.title}', date_created='{self.date_created}', " + \
               f"date_updated='{self.date_updated}', primary='{self.primary}')"


class Page(models.Model):
    MAX_FREE_PAGES = 1

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='pages_from_profile')
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500, null=True, blank=True)
    url = models.URLField(validators=[URLValidator()])
    date_created = models.DateTimeField(auto_now_add=True, validators=[validate_date_not_in_future])
    date_updated = models.DateTimeField(auto_now=True, validators=[validate_date_not_in_future])
    webrings = models.ManyToManyField('Webring', related_name='pages_from_webrings', blank=True, through='WebringPageLink')
    primary = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.profile.user.account.account_type == 'free':
            page_count = Page.objects.filter(profile=self.profile).count()
            if page_count >= Page.MAX_FREE_PAGES:
                raise ValidationError(f"Free accounts are limited to {Page.MAX_FREE_PAGES} page.")
            
        # If there are no other primary pages, mark this page as primary
        if not Page.objects.filter(profile=self.profile, primary=True).exists():
            self.primary = True
        
        if self.primary:
            # Mark all other pages of the same profile as not primary
            Page.objects.filter(profile=self.profile).exclude(id=self.id).update(primary=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __repr__(self):
        return f"Page(id={self.id}, profile={self.profile}, title='{self.title}', url='{self.url}', date_created='{self.date_created}', primary='{self.primary}')"


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