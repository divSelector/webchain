from rest_framework import serializers
from dj_rest_auth.models import get_token_model

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_active', 'last_login', 'date_joined', 'date_updated']