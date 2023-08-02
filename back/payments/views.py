from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, viewsets
import stripe
import datetime

from django.conf import settings
from webrings.models import Account


stripe.api_key = settings.STRIPE_API_KEY


class StripeSessionViewSet(viewsets.ViewSet):

    def retrieve(self, request):
        if request.user.is_authenticated:
            return Response({
                "session_id": request.user.account.stripe_checkout_session_id
            }, status=status.HTTP_200_OK)
        return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

    def _create_billing_portal(self, account):
        return_url = settings.FRONTEND_HOST + '/account'
        portal_session = stripe.billing_portal.Session.create(
            customer=account.stripe_customer_id,
            return_url=return_url,
        )
        return Response({"url": portal_session.url}, status=status.HTTP_200_OK)

    def _create_checkout_portal(self, account, request):
        return_url = settings.FRONTEND_HOST + '/account'
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
            success_url=return_url,
            cancel_url=return_url
        )
        if not account.stripe_customer_id and not account.stripe_subscription_id:
            account.stripe_checkout_session_id = checkout_session.id
            account.save()
        return Response({"url": checkout_session.url}, status=status.HTTP_200_OK)

    def create(self, request):
        if request.user.is_authenticated:
            try:
                account = Account.objects.filter(user__email=request.user).first()

                if account.stripe_subscription_id and account.stripe_customer_id and account.account_type == 'subscriber':
                    return self._create_billing_portal(account)
                else:
                    return self._create_checkout_portal(account, request)

            except Exception as e:
                print(e)
                return Response("Server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)



class StripeWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        stripe.api_key = settings.STRIPE_API_KEY

        event, status = self._construct_event_or_error(request)
        if status:
            self.event = event
            self.data_object = event['data']['object']
        else:
            error = event
            return error

        self._handle_event()

        return Response({'status': 'success'})

    def _construct_event_or_error(self, request):
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET
        if webhook_secret:
            signature = request.headers.get('stripe-signature')
            if not signature:
                return (Response({'error': "Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR), False)
            try:
                event = stripe.Webhook.construct_event(
                    payload=request.body, sig_header=signature, secret=webhook_secret
                )
            except ValueError as e:
                # Invalid payload
                return (Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST), False)
            except stripe.error.SignatureVerificationError as e:
                # Invalid signature
                return (Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST), False)
            
        else:
             return (Response({'error': "Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR), False)

        return (event, True)
    
    def _update_account_to_stripe_customer(self):
        session = self.data_object
        session_id = session.get('id')
        stripe_customer_id = session.get('customer')
        stripe_subscription_id = session.get('subscription')
        try:
            account = Account.objects.get(stripe_checkout_session_id=session_id)
        except Account.DoesNotExist as e:
            raise Exception(e)
            # ...could potentially cancel the payment here...
            # I'm not sure if it's possible for this error to arise outside of a testing webhooks scenario.
            # This is here so that we'll see it on Sentry in case it does.

        account.stripe_customer_id = stripe_customer_id
        account.stripe_subscription_id = stripe_subscription_id
        account.account_type = 'subscriber'
        account.save()

    def _update_account_on_cancel_subscription(self):

        cancel_at_timestamp = self.data_object.get('cancel_at')
        canceled_at_timestamp = self.data_object.get('canceled_at')
        if cancel_at_timestamp and canceled_at_timestamp:
            cancel_at_date = datetime.datetime.fromtimestamp(cancel_at_timestamp, tz=datetime.timezone.utc)
            canceled_at_date = datetime.datetime.fromtimestamp(canceled_at_timestamp, tz=datetime.timezone.utc)
            print("Subscription was canceled.")
            print("Cancel At Date:", cancel_at_date)
            print("Canceled At Date:", canceled_at_date)


        
        #TODO FINISH THIS

    def _update_account_on_renew_subscription(self):
        previous_attributes = self.event['data']["previous_attributes"]
        if (
            previous_attributes.get('cancel_at') is not None and
            self.data_object.get('cancel_at') is None and
            self.data_object.get('cancel_at_period_end') is False and
            self.data_object.get('canceled_at') is None
        ):
            # Subscription was renewed
            # Handle the renewal logic here
            print("Subscription was renewed.")

        #TODO FINISH THIS

    def _destroy_account_subscription(self):
        customer = self.data_object.get('customer')
        try:
            account = Account.objects.get(stripe_customer_id=customer)
        except Account.DoesNotExist:
            return
        
        account.account_type = 'free'
        account.stripe_customer_id = None
        account.stripe_subscription_id = None
        account.stripe_checkout_session_id = None
        account.save()
        print(f"{account} is now a {account.account_type} account.")

    def _handle_event(self):
        if self.event['type'] == 'checkout.session.completed':
            print('Payment Received')
            self._update_account_to_stripe_customer()

        elif self.event['type'] == 'customer.subscription.updated':
            print('Subscription updated %s' % self.event['id'])
            # These are not doing any changes on data at the moment.
            # It's possible it is not necessary to handle these updates
            # because 'customer.subscription.deleted' already handles it.
            self._update_account_on_cancel_subscription()
            self._update_account_on_renew_subscription()

        elif self.event['type'] == 'customer.subscription.deleted':
            print('Subscription deleted: %s' % self.event['id'])
            self._destroy_account_subscription()