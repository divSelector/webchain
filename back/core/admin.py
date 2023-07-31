from django.contrib import admin
from django.apps import apps
from django.conf import settings


for model in apps.get_models():
    if model.__name__ and admin.site.is_registered(model):
        if model.__name__ in settings.ADMIN_UNREGISTERED_MODELS:
            admin.site.unregister(model)
