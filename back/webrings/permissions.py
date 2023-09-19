from rest_framework import permissions

class BaseActionPermission(permissions.BasePermission):
    allowed_actions = []

    @classmethod
    def has_permission(cls, request, view):
        return (
            view.action in cls.allowed_actions or
            request.user.is_authenticated
        )

class RetrieveListOrAuthenticated(BaseActionPermission):
    allowed_actions = ['retrieve', 'list']

class NextPreviousRandomOrAuthenticated(BaseActionPermission):
    allowed_actions = ['next', 'previous', 'random']

class WebringViewPermissions(BaseActionPermission):
    allowed_actions = (
        RetrieveListOrAuthenticated.allowed_actions +
        NextPreviousRandomOrAuthenticated.allowed_actions
    )