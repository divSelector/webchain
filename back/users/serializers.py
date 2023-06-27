from rest_framework import serializers
from dj_rest_auth.models import get_token_model

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_token_model()
        fields = '__all__'
