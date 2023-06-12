from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib import admin
from django.test.client import RequestFactory

from .admin import CustomUserAdmin

User = get_user_model()


class UserModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword',
        )

        self.staffuser = User.objects.create_user(
            email='staff@staff.com',
            password='staffpassword'
        )
        self.staffuser.is_staff = True
        self.staffuser.save()

        self.superuser = User.objects.create_superuser(
            email='superuser@example.com',
            password='superpassword',
        )

        self.admin_site = admin.site

        factory = RequestFactory()

        self.request_superuser = factory.get('/')
        self.request_superuser.user = self.superuser

        self.request_staffuser = factory.get('/')
        self.request_staffuser.user = self.staffuser


    def test_create_user(self):
        """Test creating a new user"""
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.check_password('testpassword'))
        self.assertFalse(self.user.is_staff)
        self.assertTrue(self.user.is_active)
        self.assertFalse(self.user.is_superuser)


    def test_create_superuser(self):
        """Test creating a new superuser"""
        self.assertEqual(self.superuser.email, 'superuser@example.com')
        self.assertTrue(self.superuser.check_password('superpassword'))
        self.assertTrue(self.superuser.is_staff)
        self.assertTrue(self.superuser.is_active)
        self.assertTrue(self.superuser.is_superuser)


    def test_who_has_delete_permission(self):
        """Test the has_delete_permission method in the CustomUserAdmin"""
        custom_user_admin = CustomUserAdmin(User, self.admin_site)
        self.assertTrue(custom_user_admin.has_delete_permission(self.request_superuser, self.user))
        self.assertFalse(custom_user_admin.has_delete_permission(self.request_staffuser, self.user))


    def test_prevent_user_from_editing_own_permissions(self):
        # Creating a user object that represents the staff user
        obj_staffuser = self.staffuser

        # Creating a user object that represents another user
        obj_other_user = User.objects.create_user(
            email='other@user.com',
            password='password'
        )

        custom_user_admin = CustomUserAdmin(User, admin.site)

        # Test for superuser
        form_superuser = custom_user_admin.get_form(self.request_superuser, obj=self.superuser)
        self.assertEqual(
            set(form_superuser.base_fields.keys()),
            {'email', 'password', 'is_staff', 'is_active'}
        )

        # Test for staff user editing their own permissions
        form_staffuser_self = custom_user_admin.get_form(self.request_staffuser, obj=obj_staffuser)
        self.assertEqual(
            set(form_staffuser_self.base_fields.keys()),
            {'email', 'password', 'is_staff', 'is_active'}
        )

        form_staffuser_other = custom_user_admin.get_form(self.request_staffuser, obj=obj_other_user)
        self.assertNotEqual(
            set(form_staffuser_other.base_fields.keys()),
            {'email', 'password', 'is_staff', 'is_active', 'groups', 'user_permissions'}
        )