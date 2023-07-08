from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Page, WebringPageLink, Account
from ..serializers import PageSerializer, WebringSerializer, WebringPageLinkSerializer
from ..permissions import RetrieveListOrAuthenticated


class PageViewSet(viewsets.ViewSet):
    permission_classes = [RetrieveListOrAuthenticated]
    queryset = Page.objects.all()

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
            links = WebringPageLink.objects.filter(page=page)
            approved_webrings = page.webrings.filter(webringpagelink__approved=True)
            page_serializer = PageSerializer(page)
            links_serializer = WebringPageLinkSerializer(links, many=True)
            data = {
                'page': page_serializer.data,
                'webrings': WebringSerializer(approved_webrings, many=True).data
            }
            if hasattr(request.user, 'account') and request.user.account == page.account:
                data['links'] = links_serializer.data

            return Response(data)
        except Page.DoesNotExist:
            return Response({'error': 'Page not found'}, status=404)
        
    def list(self, request):
        queryset = Page.objects.all()
        serializer = PageSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        page_id = kwargs.get('page_id')
        try:
            instance = Page.objects.filter(id=page_id).first()

            if str(instance.account.user.id) != str(self.request.user.id):
                return Response({'error': 'User cannot PATCH this resource.'}, status=status.HTTP_403_FORBIDDEN)
            
            allowed_keys = ['title', 'url', 'description']

            filtered_data = {key: request.data.get(key) for key in allowed_keys if key in request.data}

            serializer = PageSerializer(instance, data=filtered_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except (Page.DoesNotExist, AttributeError):
            return Response({'error': 'Page not found'}, status=404)

