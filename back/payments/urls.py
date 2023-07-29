from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_index, name='index'),
    path('create-checkout-session', views.create_checkout_session, name='create_checkout_session'),
    path('create-portal-session', views.customer_portal, name='customer_portal'),
    path('webhook', views.webhook_received, name='webhook'),
]