from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Webring, Page, WebringPageLink, Account
from .serializers import PageSerializer, WebringSerializer, AccountSerializer
from django.db.models import Q


class WebringPagesViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = WebringSerializer
    permission_classes = []

    def list(self, request, *args, **kwargs):
        webring_id = kwargs.get('webring_id')

        try:
            webring = Webring.objects.get(id=webring_id)
        except Webring.DoesNotExist:
            return Response({'error': 'Webring not found'}, status=404)

        query = Page.objects.filter(
            Q(webrings=webring, primary=True) |
            Q(id__in=WebringPageLink.objects.filter(
                webring=webring, page__account__account_type='subscriber'
            ).values('page_id'))
        ).distinct()

        serializer = self.get_serializer(query, many=True)
        webring_serializer = WebringSerializer(webring)

        data = {'webring': webring_serializer.data, 
                'pages': serializer.data}

        return Response(data)



class PageViewSet(viewsets.ViewSet):
    serializer_class = PageSerializer
    permission_classes = []

    def list(self,  request, *args, **kwargs):
        page_id = kwargs.get('page_id')
        try:
            page = Page.objects.get(id=page_id)

            approved_webrings = Webring.objects.filter(
                webringpagelink__id=page.id, webringpagelink__approved=True
            )
            serializer = self.serializer_class(page)

            data = {
                'page': serializer.data,
                'webrings': WebringSerializer(approved_webrings, many=True).data
            }

            return Response(data)
        except Page.DoesNotExist:
            return Response({'error': 'Page not found'}, status=404)
        

class AccountViewSet(viewsets.ViewSet):
    serializer_class = AccountSerializer
    permission_classes = []

    def list(self,  request, *args, **kwargs):
        account_id = kwargs.get('account_id')
        try:
            account = Account.objects.get(id=account_id)

            owned_webrings = Webring.objects.filter(account=account_id)

            owned_pages = Page.objects.filter(account=account_id)

            serializer = self.serializer_class(account)

            data = {
                'account': serializer.data,
                'pages': PageSerializer(owned_pages, many=True).data,
                'webrings': WebringSerializer(owned_webrings, many=True).data
            }
            return Response(data)

        except Account.DoesNotExist:
            return Response({'error': 'Account not found'}, status=404)