from django.urls import path
from .views import (
    WebringPagesViewSet
)
from rest_framework.permissions import IsAuthenticated


urlpatterns = [
    path('webring/<int:webring_id>/', WebringPagesViewSet.as_view(
        {'get': 'by_webring'}
    ), name='webring-pages'),
    # # Webring URLs
    # path('webrings/', WebringListCreateView.as_view(
    #      permission_classes=[IsAuthenticated],
    # ), name='webring-list-create'),
    # path('webrings/<int:pk>/', WebringRetrieveUpdateDestroyView.as_view(
    #     permission_classes=[IsAuthenticated],
    # ), name='webring-retrieve-update-destroy'),

    # # Page URLs
    # path('pages/', PageListCreateView.as_view(
    #      permission_classes=[IsAuthenticated],
    # ), name='page-list-create'),
    # path('pages/<int:pk>/', PageRetrieveUpdateDestroyView.as_view(
    #      permission_classes=[IsAuthenticated],
    # ), name='page-retrieve-update-destroy'),

]