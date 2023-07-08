from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import Webring, Page, Account
from ..serializers import PageSerializer, WebringSerializer, AccountSerializer
from ..permissions import RetrieveListOrAuthenticated


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

        allowed_keys = ['name']

        filtered_data = {key: request.data.get(key) for key in allowed_keys if key in request.data}

        serializer = self.serializer_class(instance, data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
