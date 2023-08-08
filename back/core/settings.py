from pathlib import Path
import environ
import datetime
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from logging.config import dictConfig

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    ENVIRONMENT=(str, "staging")
)

environ.Env.read_env(BASE_DIR.parent / '.env')

if env('ENVIRONMENT') == 'development':
    DEBUG = True
else:
    DEBUG = False

SECRET_KEY = env('SECRET_KEY')

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

INSTALLED_APPS = [
    'corsheaders',
    "django.contrib.sites", 

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'users',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    
    "rest_framework",
    "rest_framework.authtoken",

    "dj_rest_auth",
    "dj_rest_auth.registration",

    "webrings",
    "payments",
    
    "core",
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
] 

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

TOKEN_EXPIRE_TIME = datetime.timedelta(hours=10)


if env('ENVIRONMENT') == 'development':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

elif env('ENVIRONMENT') == 'staging':
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

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = '/static/django/'
STATICFILES_DIRS = []

SITE_ID = 1  # Required by Django-allauth

AUTH_USER_MODEL = 'users.User'

ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "users.authentication.ExpiringTokenAuthentication",
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],

    "EXCEPTION_HANDLER": "core.exceptions.django_error_handler",

    'DEFAULT_RENDERER_CLASSES': (
         'rest_framework.renderers.JSONRenderer',
     )
}

if not env('ENVIRONMENT') == 'development' and not env('ENVIRONMENT') == 'staging':
    REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
        'dj_rest_auth':   '5/hour',
        'payments':       '9999999/second',
        'user_burst':     '60/minute',
        'user_sustained': '300/hour',
        'anon_burst':     '30/minute',
        'anon_sustained': '120/hour',
    }
    REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = [
        'rest_framework.throttling.ScopedRateThrottle',
        'core.throttle.UserBurstRateThrottle',
        'core.throttle.UserSustainedRateThrottle',
        'core.throttle.AnonBurstRateThrottle',
        'core.throttle.AnonSustainedRateThrottle',
    ]

if env('ENVIRONMENT') == 'development':
    FRONTEND_HOST = 'http://127.0.0.1:3000'

elif env('ENVIRONMENT') == 'staging':
    FRONTEND_HOST = 'https://0.0.0.0'
    ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'

if not env('ENVIRONMENT') == 'production':
    CORS_ALLOWED_ORIGINS = [
        "http://localhost",
        'http://localhost:3000',
        'http://127.0.0.1',
        'http://127.0.0.1:3000',
        'http://0.0.0.0',
        'http://0.0.0.0:3000',
        "https://localhost",
        'https://localhost:3000',
        'https://127.0.0.1',
        'https://127.0.0.1:3000',
        'https://0.0.0.0',
        'https://0.0.0.0:3000'
    ]

    CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

if env('ENVIRONMENT') == 'development':
    EMAIL_BACKEND = "users.backends.EncryptedConsoleEmailBackend"

elif env('ENVIRONMENT') == 'staging':
    EMAIL_BACKEND = "users.backends.EncryptedSmtpEmailBackend"
    EMAIL_HOST = env('EMAIL_HOST')
    EMAIL_USE_TLS = False
    EMAIL_USE_SSL = True
    EMAIL_PORT =  env('EMAIL_PORT')
    EMAIL_HOST_USER =  env('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
    DEFAULT_FROM_EMAIL = env('EMAIL_HOST_USER')

LOGIN_URL = FRONTEND_HOST + '/'
# LOGIN_REDIRECT_URL = FRONTEND_HOST + '/'

# <EMAIL_CONFIRM_REDIRECT_BASE_URL>/<key>
EMAIL_CONFIRM_REDIRECT_BASE_URL = \
    FRONTEND_HOST + "/email/confirm/"

# <PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL>/<uidb64>/<token>/
PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL = \
    FRONTEND_HOST + "/password-reset/confirm/"

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'simple': {
            'format': '%(levelname)s %(message)s',
             'datefmt': '%y %b %d, %H:%M:%S',
            },
        },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'celery': {
            'level': 'DEBUG',
            # 'class': 'logging.handlers.RotatingFileHandler',
            'class': 'logging.StreamHandler',
            # 'filename': 'celery.log',
            'formatter': 'simple',
            # 'maxBytes': 1024 * 1024 * 100,  # 100 mb
        },
    },
    'loggers': {
        'celery': {
            'handlers': ['celery', 'console'],
            'level': 'DEBUG',
        },
    }
}
dictConfig(LOGGING)


if env('ENVIRONMENT') == 'staging':
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


STRIPE_API_KEY = env('STRIPE_API_KEY')
STRIPE_WEBHOOK_SECRET = env('STRIPE_WEBHOOK_SECRET')


ADMIN_UNREGISTERED_MODELS = [
    'SocialApp',
    'SocialAccount',
    'SocialToken',
    #'TokenProxy'
]

if env('ENVIRONMENT') == 'production':
    ADMIN_UNREGISTERED_MODELS += [
        'EmailAddress',
        'Account'
    ]


CELERY_ACCEPT_CONTENT = ['json']

if env('ENVIRONMENT') == 'development':
    CELERY_BROKER_URL = "redis://localhost:6379/0"

if env('ENVIRONMENT') == 'staging':
    RABBITMQ_USER = env('RABBITMQ_USER')
    RABBITMQ_PASSWORD = env('RABBITMQ_PASSWORD')
    RABBITMQ_PORT = env('RABBITMQ_PORT')
    CELERY_BROKER_URL = f'amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@rabbitmq:{RABBITMQ_PORT}//'

ENCRYPTION_KEY = env("ENCRYPTION_KEY")

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache"
    }
}

