from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Webring, Page, WebringPageLink, Account
from ..serializers import PageSerializer, WebringSerializer, WebringPageLinkSerializer
from ..permissions import WebringViewPermissions
from django.db.models import Q
from rest_framework.decorators import action
import urllib.parse


class WebringViewSet(viewsets.ModelViewSet):
    queryset = Webring.objects.all()
    permission_classes = [WebringViewPermissions]

    @staticmethod
    def get_approved_pages(webring):
        return Page.objects.filter(
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
        ).distinct().order_by('date_created')

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

        pages = self.get_approved_pages(webring)

        links = WebringPageLink.objects.filter(webring=webring)

        pages_serializer = PageSerializer(pages, many=True)
        webring_serializer = WebringSerializer(webring)
        links_serializer = WebringPageLinkSerializer(links, many=True)
        data = {
            'webring': webring_serializer.data, 
            'pages': pages_serializer.data
        }

        if hasattr(request.user, 'account') and request.user.account == webring.account:
            data['links'] = links_serializer.data

        return Response(data)

    def list(self, request):
        queryset = Webring.objects.all()
        serializer = WebringSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        webring_id = kwargs.get('webring_id')
        try:
            instance = Webring.objects.filter(id=webring_id).first()

            if str(instance.account.user.id) != str(self.request.user.id):
                return Response({'error': 'User cannot PATCH this resource.'}, status=status.HTTP_403_FORBIDDEN)
            
            allowed_keys = ['title', 'description', 'automatic_approval']

            filtered_data = {key: request.data.get(key) for key in allowed_keys if key in request.data}

            serializer = WebringSerializer(instance, data=filtered_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        except (Webring.DoesNotExist, AttributeError):
            return Response({'error': 'Page not found'}, status=404)

    @action(detail=True, methods=['get'])
    def next(self, request, webring_id):
        webring = Webring.objects.get(pk=webring_id)
        pages = self.get_approved_pages(webring)

        via = urllib.parse.unquote(request.GET.get('via', ''))
        current_page = pages.filter(url=via).first()

        get_next = lambda current_index, total_items: (current_index + 1) % total_items
        next_page = pages[get_next(current_page.id, len(pages))]

        response_data = {
            'next': next_page.url,
            'via': via,
        }

        return Response(response_data)
    