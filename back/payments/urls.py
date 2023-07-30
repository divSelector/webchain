from django.urls import path
from .views import StripeSessionViewSet, webhook_received

urlpatterns = [
    path('session', 
        StripeSessionViewSet.as_view(
            {'get': 'retrieve', 
             'post': 'create'}
        ), name='stripe-session'),
    path('webhook', webhook_received, name='webhook')
]