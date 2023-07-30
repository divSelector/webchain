from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import stripe
import json
import datetime

from django.conf import settings
from webrings.models import Account


@api_view(['GET'])
def get_account_session_id(request):
    if request.user.is_authenticated:
        return Response({
            "session_id": request.user.account.stripe_checkout_session_id
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_checkout_session(request):
    stripe.api_key = settings.STRIPE_API_KEY

    if request.user.is_authenticated:
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
                success_url=settings.FRONTEND_HOST+'/account', #?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.FRONTEND_HOST+'/account'   #/?canceled=true'
            )

            if request.user:
                account = Account.objects.filter(user__email=request.user).first()
                account.stripe_checkout_session_id = checkout_session.id
                account.save()

            return Response({"url": checkout_session.url}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response("Server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def create_portal_session(request):
    stripe.api_key = settings.STRIPE_API_KEY

    if request.user.is_authenticated:

        if not request.user.account.stripe_customer_id:
            return Response("Payment Required", status=status.HTTP_402_PAYMENT_REQUIRED)

        try:
            return_url = settings.FRONTEND_HOST + '/account'

            portal_session = stripe.billing_portal.Session.create(
                customer=request.user.account.stripe_customer_id,
                return_url=return_url,
            )
            return Response({"url": portal_session.url}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response("Server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def webhook_received(request):
    stripe.api_key = settings.STRIPE_API_KEY
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET
    # request_data = json.loads(request.body)

    if webhook_secret:
        # Retrieve the event by verifying the signature using the raw body and secret if webhook signing is configured.
        signature = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload=request.body, sig_header=signature, secret=webhook_secret)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        # Get the type of webhook event sent - used to check the status of PaymentIntents.

    else:
        return Response({'error': "Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    data_object = event['data']['object']

    if event['type'] == 'checkout.session.completed':
        session = data_object
        session_id = session.get('id')
        stripe_customer_id = session.get('customer')
        stripe_subscription_id = session.get('subscription')

        account = Account.objects.filter(stripe_checkout_session_id=session_id).first()
        account.stripe_customer_id = stripe_customer_id
        account.stripe_subscription_id = stripe_subscription_id
        account.account_type = 'subscriber'
        account.save()

    elif event['type'] == 'customer.subscription.trial_will_end':
        print('Subscription trial will end')

    elif event['type'] == 'customer.subscription.created':
        print('Subscription created %s' % event['id'])

    elif event['type'] == 'customer.subscription.updated':
        print('Subscription updated %s' % event['id'])
        cancel_at_timestamp = data_object.get('cancel_at')
        canceled_at_timestamp = data_object.get('canceled_at')
        if cancel_at_timestamp and canceled_at_timestamp:
            cancel_at_date = datetime.datetime.fromtimestamp(cancel_at_timestamp, tz=datetime.timezone.utc)
            canceled_at_date = datetime.datetime.fromtimestamp(canceled_at_timestamp, tz=datetime.timezone.utc)
            print("Cancel At Date:", cancel_at_date)
            print("Canceled At Date:", canceled_at_date)
        else:
            print(event)



    elif event['type'] == 'customer.subscription.deleted':
        # handle subscription canceled automatically based
        # upon your subscription settings. Or if the user cancels it.
        print('Subscription canceled: %s' % event['id'])

    return Response({'status': 'success'})