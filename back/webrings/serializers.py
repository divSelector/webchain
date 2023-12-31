from rest_framework import serializers
from .models import Webring, Page, Account, WebringPageLink

from users.serializers import UserSerializer

class AccountSerializer(serializers.ModelSerializer):

    user = None

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            fields['user'] = UserSerializer()
        return fields

    class Meta:
        model = Account
        fields = ['name', 'account_type']


class PageSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Page
        fields = ['id', 'account', 'title', 'description', 'date_created', 'date_updated', 'url', 'primary']



class WebringSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Webring
        fields = ['id', 'account', 'title', 'description', 'date_created', 'date_updated', 'automatic_approval', 'primary']


class WebringPageLinkSerializer(serializers.ModelSerializer):
    page = PageSerializer()
    webring = WebringSerializer()

    class Meta:
        model = WebringPageLink
        fields = ['id', 'page', 'webring', 'approved']
