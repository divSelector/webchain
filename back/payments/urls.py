from django.urls import path
from .views import StripeSessionViewSet, StripeWebhookView

# urlpatterns = [
#     path('session', 
#         StripeSessionViewSet.as_view(
#             {'get': 'retrieve', 
#              'post': 'create'}
#         ), name='stripe-session'),
#     path('webhook', StripeWebhookView.as_view(), name='webhook')
# ]
urlpatterns = []