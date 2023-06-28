from django.urls import path
from .views import (
    WebringPagesViewSet,
    PageViewSet,
    AccountViewSet
)


urlpatterns = [
    path('webring/', 
        WebringPagesViewSet.as_view(
            {'post': 'create'}
    ), name='create-webring'),

    path('webring/<int:webring_id>/', 
        WebringPagesViewSet.as_view(
            {'get': 'retrieve'}
    ), name='retrieve-webring'),

    path('webrings/', 
        WebringPagesViewSet.as_view(
            {'get': 'list'}
        ), name='list-webrings'),


    path('page/', 
        PageViewSet.as_view(
            {'post': 'create'}
        ), name='create-page'),

    path('page/<int:page_id>/', 
        PageViewSet.as_view(
            {'get': 'retrieve'}
        ), name='retrieve-page'),

    path('pages/', 
        PageViewSet.as_view(
            {'get': 'list'}
        ), name='list-page'),

    # path('user/',
    #     AccountViewSet.as_view(
    #         {'get': 'list'}
    #     ), name='list-account'),


    path('user/',
        AccountViewSet.as_view(
            {'get': 'retrieve'}
        ), name='retrieve-account-by-token'),

    path('user/<str:account_name>/',
        AccountViewSet.as_view(
            {'get': 'retrieve',
             'patch': 'partial_update'}
        ), name='retrieve-update-account'),

    # path('user/<str:account_id>/update/',
    #     AccountViewSet.as_view(
    #         {'put': 'update'}
    #     ), name='update-account'),
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