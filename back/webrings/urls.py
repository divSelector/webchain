from django.urls import path
from .viewsets.ring import WebringViewSet
from .viewsets.page import PageViewSet
from .viewsets.link import WebringPageLinkViewSet
from .viewsets.account import AccountViewSet

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


    path('webring/<int:webring_id>/next', 
        WebringViewSet.as_view(
            {'get': 'next'}
        ), name='next-from-webring'),


    path('webring/<int:webring_id>/previous', 
        WebringViewSet.as_view(
            {'get': 'previous'}
        ), name='previous-from-webring'),


    path('webring/<int:webring_id>/random', 
        WebringViewSet.as_view(
            {'get': 'random'}
        ), name='random-from-webring'),


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

    path('link/<int:webring_id>/',
        WebringPageLinkViewSet.as_view(
            {'get': 'list'}
        ), name='list-links-by-webring'),

    path('link/<int:webring_id>/<int:page_id>/',
        WebringPageLinkViewSet.as_view(
            {'post': 'create'}
        ), name='create-link'),

    path('link/update/<int:link_id>/',
        WebringPageLinkViewSet.as_view(
            {'patch': 'partial_update'}
        ), name='update-link'),


    path('link/delete/<int:link_id>/',
        WebringPageLinkViewSet.as_view(
            {'delete': 'destroy'}
        ), name='destroy-link'),

]