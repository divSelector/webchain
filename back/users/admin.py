from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from django import forms
from django.contrib.auth import get_user_model
from django.contrib.admin.widgets import FilteredSelectMultiple    
from django.contrib.auth.models import Group
from allauth.account.models import EmailAddress
from allauth.account.admin import EmailAddressAdmin
from allauth.account.adapter import get_adapter

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        else:
            # To prevent staff users from deleting a model instance, regardless of their permissions...
            # When obj is None, the user requested the list view.
            # When obj is not None, the user requested the change view of a specific instance.
            return False

    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        is_superuser = request.user.is_superuser
        disabled_fields = set() 

        if not is_superuser:
            disabled_fields |= {
                'email',
                'is_superuser',
                'user_permissions'
            }

        # Prevent non-superusers from editing their own permissions
        if (
            not is_superuser
            and obj is not None # When obj is None, the form is used to create a new user.
                                # When obj is not None, the form is used to edit an existing user.
            and obj == request.user
            # To check if the user making the request is operating on themselves, you compare request.user 
            # with obj. Because this is the user admin, obj is either an instance of User, or None. 
            # When the user making the request, request.user, is equal to obj, then it means that the
            # user is updating themselves. In this case, you disable all sensitive fields that can be used to gain permissions.
        ):
            disabled_fields |= {
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            }

        for f in disabled_fields:
            if f in form.base_fields:
                form.base_fields[f].disabled = True

        return form    

    def activate_users(self, request, queryset):
        assert request.user.has_perm('auth.change_user')
        cnt = queryset.filter(is_active=False).update(is_active=True)
        self.message_user(request, 'Activated {} users.'.format(cnt))

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not request.user.has_perm('auth.change_user'):
            del actions['activate_users']
        return actions

    actions = ['activate_users']
    list_display = ('email', 'is_staff', 'is_active', 'date_joined', 'last_login')
    list_filter = ('is_staff', 'is_active', 'date_joined', 'last_login')
    search_fields = ('email',)
    ordering = ('email', 'date_joined', 'last_login')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    readonly_fields = [
        'date_joined',
    ]
    activate_users.short_description = 'Activate Users'


class GroupAdminForm(forms.ModelForm):
    class Meta:
        model = Group
        exclude = []

    users = forms.ModelMultipleChoiceField(
         queryset=User.objects.all(), 
         required=False,
         widget=FilteredSelectMultiple('users', False)
    )

    def __init__(self, *args, **kwargs):
        super(GroupAdminForm, self).__init__(*args, **kwargs)
        # If it is an existing group (saved objects have a pk).
        if self.instance.pk:
            # Populate the users field with the current Group users.
            self.fields['users'].initial = self.instance.user_set.all()

    def save_m2m(self):
        self.instance.user_set.set(self.cleaned_data['users'])

    def save(self, *args, **kwargs):
        instance = super(GroupAdminForm, self).save()
        self.save_m2m()
        return instance
    

admin.site.unregister(Group)

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    form = GroupAdminForm
    filter_horizontal = ['permissions']

admin.site.unregister(EmailAddress)

@admin.register(EmailAddress)
class CustomEmailAddressAdmin(EmailAddressAdmin):
    list_display = ("email", "user", "primary", "verified")
    list_filter = ("primary", "verified")
    search_fields = []
    raw_id_fields = ("user",)
    actions = ["make_verified"]

    def get_search_fields(self, request):
        base_fields = get_adapter(request).get_user_search_fields()
        return ["email"] + list(map(lambda a: "user__" + a, base_fields))

    def make_verified(self, request, queryset):
        assert request.user.has_perm('auth.change_user')
        queryset.update(verified=True)
        cnt = queryset.filter(verified=False).update(verified=True)
        self.message_user(request, 'Activated {} users.'.format(cnt))

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not request.user.has_perm('auth.change_user'):
            del actions['make_verified']
        return actions

    make_verified.short_description = "Mark selected email addresses as verified"
