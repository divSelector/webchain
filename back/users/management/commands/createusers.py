from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Initialize Users'

    def handle(self, *args, **options):
        # Create Superuser
        User.objects.create_superuser(email='admin@admin.com', password='admin')
        self.stdout.write(self.style.SUCCESS('Superuser created successfully.'))

        # Create Regular Users
        names = ['user1', 'user2', 'user3']
        for name in names:
            email = f'{name}@example.com'
            User.objects.create_user(email=email, password='password')
            self.stdout.write(self.style.SUCCESS(f'User "{email}" created successfully.'))