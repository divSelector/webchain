from rest_framework import serializers
from .models import Webring, Page, Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'account_type']


class WebringSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    class Meta:
        model = Webring
        fields = ['id', 'account', 'title', 'description', 'date_created', 'date_updated']


class PageSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Page
        fields = ['id', 'account', 'title', 'description', 'date_created', 'date_updated', 'url',]
