 
# div_django_users

This is a template for a basic allauth users app. 

- It has a custom model with email for username.
- It prevents not-superuser staff users from abusing the admin page (to some capacity).
- It has stock templates and static files for the class based generic auth views.

Since I originally made this, I've extended it quite a bit.

- `authentication.py` contains an extension of the basic DRF TokenAuthentication that incorporates expiring tokens. To use it, you should set `TOKEN_EXPIRE_TIME` to something like `datetime.timedelta(hours=10)`
- `backends.py` contains custom email backends that serialize EmailMessage objects to json and passes them to celery, for async processing. Also see `tasks.py`. The email is also encrypted before it is passed to the message broker and decrypted when it gets to the worker.

## Quick start

1. Add "users" to your INSTALLED_APPS setting like this::


```
INSTALLED_APPS = [
    'corsheaders',
    "django.contrib.sites", 

    ...

    'users',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    "rest_framework",
    "rest_framework.authtoken",
    "dj_rest_auth",
    "dj_rest_auth.registration",
]
```

2. Include the users URLconf in your project urls.py like this::

```
    urlpatterns = [
        path('api/auth/', include('users.urls')),
        path('admin/', admin.site.urls),
    ]

```

3. You will need these settings in your settings.py

```
    AUTHENTICATION_BACKENDS = [
        'django.contrib.auth.backends.ModelBackend',
        'allauth.account.auth_backends.AuthenticationBackend',
    ]

    MIDDLEWARE = [
        ...
        'corsheaders.middleware.CorsMiddleware',
        'django.middleware.common.CommonMiddleware',
        ...
    ]

    AUTHENTICATION_BACKENDS = [
        'django.contrib.auth.backends.ModelBackend',
        'allauth.account.auth_backends.AuthenticationBackend',
    ]


    STATICFILES_DIRS = []

    SITE_ID = 1  # Required by Django-allauth
    # LOGIN_REDIRECT_URL = '/'  # URL to redirect the user after login
    # LOGIN_URL = "/u/login"

    AUTH_USER_MODEL = 'users.User'
    ACCOUNT_USER_MODEL_USERNAME_FIELD = None
    ACCOUNT_USERNAME_REQUIRED = False
    ACCOUNT_AUTHENTICATION_METHOD = 'email'

    REST_FRAMEWORK = {
        "DEFAULT_AUTHENTICATION_CLASSES": [
            "rest_framework.authentication.ExpiringTokenAuthentication",
        ]
    }

    ACCOUNT_EMAIL_REQUIRED = True
    ACCOUNT_EMAIL_VERIFICATION = "mandatory"


FRONTEND_HOST = 'http://127.0.0.1:3000'


CORS_ALLOWED_ORIGINS = [
    FRONTEND_HOST,  # 'http://127.0.0.1:3000'
    "http://localhost:3000"
]


EMAIL_BACKEND = "users.backends.AsyncSmtpEmailBackend"
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_USE_TLS = False
EMAIL_USE_SSL = True
EMAIL_PORT =  env('EMAIL_PORT')
EMAIL_HOST_USER =  env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('EMAIL_HOST_USER')

EMAIL_CONFIRM_REDIRECT_BASE_URL>/<key>
EMAIL_CONFIRM_REDIRECT_BASE_URL = \
    FRONTEND_HOST + "/email/confirm/"

PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL>/<uidb64>/<token>/
PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL = \
    FRONTEND_HOST + "/password-reset/confirm/"


```

4. Run `python manage.py migrate` to create the user model.

5. Run `python manage.py createsuperuser` to create a superuser to login.

6. Run `python manage.py creategroups` to initialize groups with permissions.

7. Start the development server and visit http://127.0.0.1:8000/admin/

