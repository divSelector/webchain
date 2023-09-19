from django.contrib import admin
from django.apps import apps
from django.conf import settings
from django.contrib.auth.decorators import login_required


for model in apps.get_models():
    if model.__name__ and admin.site.is_registered(model):
        if model.__name__ in settings.ADMIN_UNREGISTERED_MODELS:
            admin.site.unregister(model)

# admin.site.login = login_required(admin.site.login)