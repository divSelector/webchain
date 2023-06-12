from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress
from django.contrib.auth.models import Permission
from allauth.socialaccount.models import SocialAccount
from django.contrib.contenttypes.models import ContentType

UserModel = get_user_model()

class Command(BaseCommand):
    help = 'Initialize Groups'

    def handle(self, *args, **options):
        # can-view-accounts
        group_name = 'can-view-accounts'
        group, _ = Group.objects.get_or_create(name=group_name)
        self.stdout.write(f'Group "{group_name}" initialized')
        models = [
            (UserModel, 'view_user'),
            (EmailAddress, 'view_emailaddress'),
            (SocialAccount, 'view_socialaccount')

        ]
        for model, codename in models:
            content_type = ContentType.objects.get_for_model(model)
            permission = Permission.objects.get(
                content_type=content_type, 
                codename=codename
            )
            group.permissions.add(permission)
            self.stdout.write(f'Added {codename} permission to group "{group_name}"')


