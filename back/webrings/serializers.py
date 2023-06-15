from rest_framework import serializers
from .models import Webring, Page


class WebringSerializer(serializers.ModelSerializer):
    class Meta:
        model = Webring
        fields = '__all__'


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'description', 'date_created', 'date_updated']
