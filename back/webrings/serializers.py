from rest_framework import serializers
from .models import Webring, Page, Account, WebringPageLink

class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = ['id', 'name', 'account_type']



class PageSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Page
        fields = ['id', 'account', 'title', 'description', 'date_created', 'date_updated', 'url']



class WebringPageLinkSerializer(serializers.ModelSerializer):
    page = PageSerializer()

    class Meta:
        model = WebringPageLink
        fields = ['page', 'approved']


class WebringSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Webring
        fields = ['id', 'account', 'title', 'description', 'date_created', 'date_updated']