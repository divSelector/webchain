from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Webring, Page, WebringPageLink, Account
from .serializers import PageSerializer, WebringSerializer, AccountSerializer
from django.db.models import Q


class RetrieveListOrAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        for action in ['retrieve', 'list']:
            if view.action == action:
                return True  # Allow unauthenticated access
        return request.user and request.user.is_authenticated


class WebringPagesViewSet(viewsets.ModelViewSet):
    queryset = Webring.objects.all()
    permission_classes = [RetrieveListOrAuthenticated]

    def create(self, request):
        user = request.user
        account = Account.objects.get(user=user)
        data = request.data
        title = data.get('title')
        description = data.get('description')
        new_webring = Webring.objects.create(account=account, title=title, description=description)

        return Response({'message': 'Webring created', 'id': new_webring.id}, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        webring_id = kwargs.get('webring_id')

        try:
            webring = Webring.objects.get(id=webring_id)
        except Webring.DoesNotExist:
            return Response({'error': 'Webring not found'}, status=404)

        pages = Page.objects.filter(
            # Include primary pages from all accounts marked as approved
            Q(
                webrings=webring,
                primary=True,
                webringpagelink__approved=True
            ) |
            # Include non-primary pages of subscriber accounts marked as approved
            Q(
                id__in=WebringPageLink.objects.filter(
                    webring=webring,
                    page__account__account_type='subscriber',
                    approved=True
                ).values('page_id')
            )
        ).distinct()

        pages_serializer = PageSerializer(pages, many=True)
        webring_serializer = WebringSerializer(webring)
        data = {
            'webring': webring_serializer.data, 
            'pages': pages_serializer.data
        }

        return Response(data)

    def list(self, request):
        queryset = Webring.objects.all()
        serializer = WebringSerializer(queryset, many=True)
        return Response(serializer.data)



class PageViewSet(viewsets.ViewSet):
    permission_classes = [RetrieveListOrAuthenticated]

    def create(self, request):
        user = request.user
        account = Account.objects.get(user=user)
        
        data = request.data
        title = data.get('title')
        description = data.get('description')
        url = data.get('url')
        new_page = Page.objects.create(account=account, title=title, description=description, url=url)

        return Response({'message': 'Page created', 'id': new_page.id}, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        page_id = kwargs.get('page_id')
        try:
            page = Page.objects.get(id=page_id)
            approved_webrings = Webring.objects.filter(
                webringpagelink__id=page.id, webringpagelink__approved=True
            )

            page_serializer = PageSerializer(page)
            data = {
                'page': page_serializer.data,
                'webrings': WebringSerializer(approved_webrings, many=True).data
            }

            return Response(data)
        except Page.DoesNotExist:
            return Response({'error': 'Page not found'}, status=404)
        
    def list(self, request):
        queryset = Page.objects.all()
        serializer = PageSerializer(queryset, many=True)
        return Response(serializer.data)

        

class AccountViewSet(viewsets.ViewSet):
    serializer_class = AccountSerializer
    authentication_classes = [TokenAuthentication]
    

    def get_permissions(self):
        if self.action == 'retrieve':
            if self.kwargs.get('account_name') is not None:
                return [RetrieveListOrAuthenticated()]
            else:
                return [IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        if self.action == 'partial_update' and self.request.user.is_authenticated:
            return Account.objects.filter(pk=self.request.user.pk)
        return Account.objects.all()
    

    def retrieve(self,  request, *args, **kwargs):
        account_name = kwargs.get('account_name')
        if account_name is not None:
            try:
                account = Account.objects.get(name=account_name)
            except Account.DoesNotExist:
                return Response({'error': 'Account not found'}, status=404)
        else:
            try:
                account = Account.objects.get(user=request.user)
            except Account.DoesNotExist:
                return Response({'error': 'Account not found'}, status=404)
        
        owned_webrings = Webring.objects.filter(account=account)
        owned_pages = Page.objects.filter(account=account)

        serializer = self.serializer_class(account, context={'request': request})
        data = {
            'account': serializer.data,
            'pages': PageSerializer(owned_pages, many=True).data,
            'webrings': WebringSerializer(owned_webrings, many=True).data
        }
        return Response(data)

    def partial_update(self, request, *args, **kwargs):
        name = kwargs.get('account_name')
        instance = Account.objects.filter(name=name).first()

        if str(instance.name) != self.request.user.account.name:
            return Response({'error': 'Wrong account name'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
