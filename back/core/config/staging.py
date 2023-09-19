from core.config.base import *
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

DEBUG = False
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}

FRONTEND_HOST = 'https://0.0.0.0'
ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'

LOGIN_URL = FRONTEND_HOST + '/'

EMAIL_CONFIRM_REDIRECT_BASE_URL = \
    FRONTEND_HOST + "/email/confirm/"

PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL = \
    FRONTEND_HOST + "/password-reset/confirm/"

CORS_ALLOWED_ORIGINS = CSRF_TRUSTED_ORIGINS = [
    "https://localhost",
    'https://127.0.0.1',
    'https://0.0.0.0',
]

EMAIL_BACKEND = "users.backends.EncryptedSmtpEmailBackend"
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_USE_TLS = False
EMAIL_USE_SSL = True
EMAIL_PORT =  env('EMAIL_PORT')
EMAIL_HOST_USER =  env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('EMAIL_HOST_USER')

sentry_sdk.init(
    dsn=env('SENTRY_STAGE_DSN'),
    integrations=[DjangoIntegration()],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)

RABBITMQ_USER = env('RABBITMQ_USER')
RABBITMQ_PASSWORD = env('RABBITMQ_PASSWORD')
RABBITMQ_PORT = env('RABBITMQ_PORT')
CELERY_BROKER_URL = f'amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@rabbitmq:{RABBITMQ_PORT}//'