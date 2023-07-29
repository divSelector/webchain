from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
import stripe

from django.conf import settings

# Create your views here.
@api_view(['POST'])
def create_checkout_session(request):
    stripe.api_key = settings.STRIPE_API_KEY

    try:
        lookup_key = request.data.get('lookup_key')
        prices = stripe.Price.list(
            lookup_keys=[lookup_key],
            expand=['data.product']
        )

        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': prices.data[0].id,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=f'{settings.FRONTEND_HOST}/account/?success=true&session_id={CHECKOUT_SESSION_ID}',  # Replace with your actual success URL
            cancel_url=f'{settings.FRONTEND_HOST}/account/?canceled=true'
        )
        return redirect(checkout_session.url, status=status.HTTP_303_SEE_OTHER)
    except Exception as e:
        print(e)
        return Response("Server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)