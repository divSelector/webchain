from django.contrib.auth import get_user_model
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Account, Page, Webring
from faker import Faker
from django.core.exceptions import ValidationError

User = get_user_model()
fake = Faker()

@receiver(post_save, sender=User)
def create_account(sender, instance, created, **kwargs):
    if created:
        while True:
            try:
                account = Account.objects.create(user=instance, name=fake.user_name())
                break
            except ValidationError:
                print("Username already exists.")
                continue
        account.save()
        
def create_pre_save_signal(model_class):
    
    @receiver(pre_save, sender=model_class, weak=False)
    def update_primary(sender, instance, **kwargs):
        if not model_class.objects.filter(account=instance.account, primary=True).exists():
            instance.primary = True

        if instance.primary:
            # Mark all other pages/webrings of the same account as not primary
            print(instance)
            model_class.objects.filter(account=instance.account).exclude(id=instance.id).update(primary=False)

    return update_primary


for model_class in [Page, Webring]:
    create_pre_save_signal(model_class)