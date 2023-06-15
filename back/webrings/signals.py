from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile, Account

User = get_user_model()

@receiver(post_save, sender=User)
def create_profile_and_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(user=instance)
        Profile.objects.create(user=instance)