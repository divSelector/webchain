from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import random

from webrings.models import Webring, Page, WebringPageLink

from faker import Faker

User = get_user_model()

fake = Faker()

class Command(BaseCommand):
    help = 'Create Some Fake Model Instances'

    def handle(self, *args, **options):
        users = User.objects.all()
        subscribed_account = users[1].account
        subscribed_account.account_type = 'subscriber'
        subscribed_account.save()
        self.stdout.write(self.style.SUCCESS(f"{subscribed_account} is account_type='subscriber'"))
        webring_owner = users.first().account
        webring = Webring.objects.create(
            account=webring_owner, 
            title="Cool Webring",
            description=fake.paragraph(nb_sentences=5, variable_nb_sentences=False)
        )
        self.stdout.write(self.style.SUCCESS(f"{webring_owner} is owner of {webring}"))
        for user in users:
            user.account.name = fake.user_name()
            user.account.save()
            for i in range(5):
                page = Page.objects.create(
                    account=user.account, 
                    title=fake.catch_phrase(), 
                    url="https://"+fake.domain_name(),
                    description=fake.paragraph(nb_sentences=5, variable_nb_sentences=False)
                )
                page.save()
                link = WebringPageLink(page=page, webring=webring)
                if random.random() < 0.5:
                    link.approved = True
                link.save()
                self.stdout.write(self.style.SUCCESS(f"{page} is created and added to {webring} as {link.approved}"))


