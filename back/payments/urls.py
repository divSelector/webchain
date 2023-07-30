from django.urls import path
from . import views

urlpatterns = [
    # path('', views.get_index, name='index'),
    path('create-checkout-session', views.create_checkout_session, name='create_checkout_session'),
    path('create-portal-session', views.create_portal_session, name='create_portal_session'),
    path('webhook', views.webhook_received, name='webhook'),
    path('get-session', views.get_account_session_id, name='get_account_session_id')
]