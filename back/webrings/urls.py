from django.urls import path
from .views import (
    WebringPagesViewSet,
    PageViewSet,
    AccountViewSet
)
from rest_framework.permissions import IsAuthenticated


urlpatterns = [
    path('webring/<int:webring_id>/', WebringPagesViewSet.as_view(
        {'get': 'list'}
    ), name='view-webring'),
    path('page/<int:page_id>/', PageViewSet.as_view(
        {'get': 'list'}
    ), name='view-page'),
    path('user/<int:account_id>/', AccountViewSet.as_view(
        {'get': 'list'}
    ), name='view-account'),
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