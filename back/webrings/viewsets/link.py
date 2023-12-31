from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from users.authentication import ExpiringTokenAuthentication
from ..models import Webring, Page, WebringPageLink
from ..serializers import WebringPageLinkSerializer
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from ..utils import send_email
from django.conf import settings

class WebringPageLinkViewSet(viewsets.ViewSet):
    serializer_class = WebringPageLinkSerializer
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = []
    queryset = WebringPageLink.objects.all()

    def create(self, request, webring_id, page_id):
        page = get_object_or_404(Page, pk=page_id)

        if not request.user.account == page.account:
            return Response({'message': 'Not authorized to handle resource'}, status=403) 
        
        webring = get_object_or_404(Webring, pk=webring_id)
        link, created = WebringPageLink.objects.get_or_create(
            page=page,
            webring=webring,
            approved=webring.automatic_approval
        )

        if created:

            if not link.approved:
                subject="[neorings.org] A webmaster wants to join your webring."
                send_email(
                    settings.DEFAULT_FROM_EMAIL, [link.webring.account.user.email],
                    f"Subject: {subject}\n\r\n\rHello, {link.page.account.name} wants to join their page '{link.page.title}' to your ring '{link.webring.title}.' Log in to accept their request!", 
                )

            return Response({'message': 'WebringPageLink created', 'id': link.id}, status=201)
        else:
            return Response({'message': 'WebringPageLink already exists'}, status=409)

    def list(self, request, webring_id):
        webring = get_object_or_404(Webring, pk=webring_id)
        approved_links = self.queryset.filter(webring__id=webring_id, approved=True)
        not_approved_links = self.queryset.filter(webring__id=webring_id, approved=False)
        try:
            if not request.user.account == webring.account:
                approved_links = approved_links.filter(page__account=request.user.account)
                not_approved_links = not_approved_links.filter(page__account=request.user.account)
                
            # Serialize the queryset and return the response
            return Response({
                'approved': self.serializer_class(approved_links, many=True).data,
                'not_approved':  self.serializer_class(not_approved_links, many=True).data
            }, status=200)
        except AttributeError:
            return Response({'message': 'Not authorized to handle resource'}, status=403) 

    def partial_update(self, request, link_id):
        link = get_object_or_404(WebringPageLink, pk=link_id)

        if not request.user.account == link.webring.account:
            return Response({'message': 'Not authorized to handle resource'}, status=status.HTTP_401_UNAUTHORIZED)

        allowed_keys = ['approved']
        filtered_data = {key: request.data.get(key) for key in allowed_keys if key in request.data}

        serializer = self.serializer_class(link, data=filtered_data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'message': e.detail}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        if link.approved:
            subject = "[neorings.org] Your page was joined to a webring."
            send_email(
                settings.DEFAULT_FROM_EMAIL, [link.page.account.user.email],
                f"Subject: {subject}\n\r\n\rHello, {link.webring.account.user.email} has accepted your page '{link.page.title}' into their ring '{link.webring.title}'", 
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, link_id):
        link = get_object_or_404(WebringPageLink, pk=link_id)
        if not (request.user.account == link.webring.account or request.user.account == link.page.account):
            return Response({'message': 'Not authorized to handle resource'}, status=status.HTTP_401_UNAUTHORIZED)
        
        link.delete()

        return Response({'message': 'Link deleted.'}, status=status.HTTP_204_NO_CONTENT)
