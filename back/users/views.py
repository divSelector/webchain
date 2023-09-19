from django.conf import settings
from django.http import HttpResponseRedirect
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404
from allauth.account.admin import EmailAddress
from allauth.account.utils import send_email_confirmation
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.views import APIView
from dj_rest_auth.views import LoginView
from dj_rest_auth.models import get_token_model
from dj_rest_auth.app_settings import api_settings as dj_rest_auth_api_settings
from datetime import datetime
import pytz
from django.conf import settings


User = get_user_model()


class CustomLoginView(LoginView):

    def login(self):
        self.user = self.serializer.validated_data['user']
        self.token_model = get_token_model()
        if self.token_model:
            utc_now = datetime.utcnow()
            utc_now = utc_now.replace(tzinfo=pytz.utc)
            expire_time = utc_now - settings.TOKEN_EXPIRE_TIME

            self.token_model.objects.filter(user=self.user, created__lt=expire_time).delete()
            self.token = dj_rest_auth_api_settings.TOKEN_CREATOR(
                self.token_model, self.user, self.serializer
            )


class NewEmailConfirmation(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        user = get_object_or_404(User, email=request.data['email'])
        emailAddress = EmailAddress.objects.filter(user=user, verified=True).exists()

        if emailAddress:
            return Response({'message': 'This email is already verified'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                send_email_confirmation(request, user=user)
                return Response({'message': 'Email confirmation sent'}, status=status.HTTP_201_CREATED)
            except APIException:
                return Response({'message': 'This email does not exist, please create a new account'}, status=status.HTTP_403_FORBIDDEN)
            


def email_confirm_redirect(request, key):
    return HttpResponseRedirect(
        f"{settings.EMAIL_CONFIRM_REDIRECT_BASE_URL}{key}/"
    )


def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )