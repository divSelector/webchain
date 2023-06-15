from django.apps import AppConfig


class WebringsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webrings'

    def ready(self):
        import webrings.signals
