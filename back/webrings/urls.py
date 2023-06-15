from django.urls import path
from .views import (
    WebringPagesViewSet,
    PageViewSet,
    AccountViewSet
)
from rest_framework.permissions import IsAuthenticated


urlpatterns = [
    path('webring/', 
        WebringPagesViewSet.as_view(
            {'post': 'create'}
    ), name='create-webring'),

    path('webring/<int:webring_id>/', 
        WebringPagesViewSet.as_view(
            {'get': 'list'}
    ), name='list-webring'),


    path('page/', 
        PageViewSet.as_view(
            {'post': 'create'}
        ), name='create-page'),

    path('page/<int:page_id>/', 
        PageViewSet.as_view(
            {'get': 'list'}
        ), name='list-page'),

    # path('user/',
    #     AccountViewSet.as_view(
    #         {'get': 'list'}
    #     ), name='list-account'),

    path('user/<int:account_id>/',
        AccountViewSet.as_view(
            {'get': 'list'}
        ), name='list-account'),
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