from django.contrib.auth.models import BaseUserManager
from django.utils import timezone
from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress

class UserManager(BaseUserManager):
    def _create_user(self, email, password, is_staff, is_superuser, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        now = timezone.now()
        user = self.model(
            email=self.normalize_email(email),
            is_staff=is_staff, 
            is_active=True,
            is_superuser=is_superuser, 
            last_login=now,
            date_joined=now, 
            **extra_fields
        )
        user.set_password(password)
        user.save()
        
        return user


    def create_user(self, email, password, **extra_fields):
        return self._create_user(email, password, False, False, **extra_fields)


    def create_superuser(self, email, password, **extra_fields):
        user=self._create_user(email, password, True, True, **extra_fields)
        return user
