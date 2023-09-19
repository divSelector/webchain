from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/', include('webrings.urls')),
    path('api/auth/', include('users.urls')),
    path('stripe/', include('payments.urls')),
    path('admin/', admin.site.urls)
]
