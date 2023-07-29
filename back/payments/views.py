from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
import stripe
import json

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
            success_url=settings.FRONTEND_HOST+'/account/?success=true&session_id={CHECKOUT_SESSION_ID}',
            cancel_url=settings.FRONTEND_HOST+'/account/?canceled=true'
        )
        return Response({"url": checkout_session.url}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response("Server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_portal_session(request):
    stripe.api_key = settings.STRIPE_API_KEY

    # For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    # Typically this is stored alongside the authenticated user in your database.
    checkout_session_id = request.data.get('session_id')
    
    try:
        checkout_session = stripe.checkout.Session.retrieve(checkout_session_id)

        # This is the URL to which the customer will be redirected after they are
        # done managing their billing with the portal.
        return_url = settings.FRONTEND_HOST + '/account'

        portal_session = stripe.billing_portal.Session.create(
            customer=checkout_session.customer,
            return_url=return_url,
        )
        return redirect(portal_session.url, status=status.HTTP_303_SEE_OTHER)
    except Exception as e:
        print(e)
        return Response("Server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@permission_classes([AllowAny])
def webhook_received(request):
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET
    print(webhook_secret)
    request_data = json.loads(request.body)

    if webhook_secret:
        # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
        signature = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload=request.body, sig_header=signature, secret=webhook_secret)
            data = event['data']
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        # Get the type of webhook event sent - used to check the status of PaymentIntents.
        event_type = event['type']
    else:
        data = request_data['data']
        event_type = request_data['type']
    data_object = data['object']

    print('event ' + event_type)

    if event_type == 'checkout.session.completed':
        print('🔔 Payment succeeded!')
    elif event_type == 'customer.subscription.trial_will_end':
        print('Subscription trial will end')
    elif event_type == 'customer.subscription.created':
        print('Subscription created %s' % event['id'])
        customer_id = data_object['customer']
        print(customer_id)
    elif event_type == 'customer.subscription.updated':
        print('Subscription created %s' % event['id'])
    elif event_type == 'customer.subscription.deleted':
        # handle subscription canceled automatically based
        # upon your subscription settings. Or if the user cancels it.
        print('Subscription canceled: %s' % event['id'])

    return Response({'status': 'success'})