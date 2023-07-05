from django.urls import path
from .views import (
    WebringViewSet,
    PageViewSet,
    AccountViewSet
)


urlpatterns = [
    path('webring/', 
        WebringViewSet.as_view(
            {'post': 'create'}
        ), name='create-webring'),

    path('webring/<int:webring_id>/', 
        WebringViewSet.as_view(
            {'get': 'retrieve',
             'patch': 'partial_update'}
        ), name='retrieve-update-webring'),


    path('webrings/', 
        WebringViewSet.as_view(
            {'get': 'list'}
        ), name='list-webrings'),



    path('page/', 
        PageViewSet.as_view(
            {'post': 'create'}
        ), name='create-page'),

    path('page/<int:page_id>/', 
        PageViewSet.as_view(
            {'get': 'retrieve',
             'patch': 'partial_update'}
        ), name='retrieve-update-page'),


    path('pages/', 
        PageViewSet.as_view(
            {'get': 'list'}
        ), name='list-page'),



    path('user/',
        AccountViewSet.as_view(
            {'get': 'retrieve'}
        ), name='retrieve-account-by-token'),

    path('user/<str:account_name>/',
        AccountViewSet.as_view(
            {'get': 'retrieve',
             'patch': 'partial_update'}
        ), name='retrieve-update-account'),
]