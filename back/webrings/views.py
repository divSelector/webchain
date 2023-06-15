from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Webring, Page
# from .serializers import PageSerializer
from django.db.models import Q



# class WebringPagesViewSet(viewsets.ModelViewSet):
#     queryset = Page.objects.all()
#     serializer_class = PageSerializer
#     permission_classes = []

#     @action(detail=False, 
#             methods=['get'], 
#             url_path='webring/(?P<webring_id>\d+)')
    
#     def by_webring(self, request, webring_id=None):
#         try:
#             webring = Webring.objects.get(id=webring_id)
#         except Webring.DoesNotExist:
#             return Response({'error': 'Webring not found'}, status=404)

#         query = Page.objects.filter(
#             Q(webrings=webring, primary=True) |
#             Q(id__in=WebringPageLink.objects.filter(
#                 webring=webring, page__account__type='subscriber'
#             ).values('page_id'))
#         ).distinct()

#         serializer = self.get_serializer(query, many=True)
#         return Response(serializer.data)
