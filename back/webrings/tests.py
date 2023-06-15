from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from webrings.models import Page, Webring

User = get_user_model()

class WebringsTestCases(TestCase):
    def setUp(self):
        self.free_user = User.objects.create_user(email='testuser', password='testpassword')
        self.free_account = self.free_user.account
        self.free_account.account_type = 'free'
        self.free_account.save()
        self.subscribed_user = User.objects.create_user(email='testuser2', password='testpassword')
        self.subscribed_account = self.subscribed_user.account
        self.subscribed_account.account_type = 'subscribed'
        self.subscribed_account.save()
        Page.MAX_FREE_PAGES = 1
        Webring.MAX_FREE_WEBRINGS = 1

    def test_free_account_max_pages_limit(self):
        Page.objects.create(profile=self.free_user.profile, title='First Page', url='firstpage.com')
        with self.assertRaises(ValidationError) as cm:
            Page.objects.create(profile=self.free_user.profile, title='Second Page', url='secondpage.com')

    def test_subscribed_account_max_pages_limit(self):
        Page.objects.create(profile=self.subscribed_user.profile, title='First Page', url='firstpage.com')
        try:
            Page.objects.create(profile=self.subscribed_user.profile, title='Second Page', url='secondpage.com')
        except ValidationError:
            self.fail("ValidationError should not have been raised.")

    def test_free_account_max_webrings_limit(self):
        Webring.objects.create(profile=self.free_user.profile, title='First Webring')
        with self.assertRaises(ValidationError) as cm:
            Webring.objects.create(profile=self.free_user.profile, title='Second Webring')

    def test_subscribed_account_max_webrings_limit(self):
        Webring.objects.create(profile=self.subscribed_user.profile, title='First Webring')
        
        try:
            Webring.objects.create(profile=self.subscribed_user.profile, title='Second Webring')
        except ValidationError:
            self.fail("ValidationError should not have been raised.")

    def test_primary_page_assignment(self):
        # Create the first page
        first_page = Page.objects.create(profile=self.subscribed_user.profile, title="First Page", url="example.com")
        self.assertEqual(first_page.primary, True)

        # Create the second page
        second_page = Page.objects.create(profile=self.subscribed_user.profile, title="Second Page", url="example.com")
        self.assertEqual(second_page.primary, False)

        # Set the second page as primary
        second_page.primary = True
        second_page.save()

        # Refresh the first page from the database
        first_page.refresh_from_db()
        self.assertEqual(first_page.primary, False)

    def test_primary_webring_assignment(self):
        # Create the first Webring
        first_webring = Webring.objects.create(profile=self.subscribed_user.profile, title="First Ring")
        self.assertEqual(first_webring.primary, True)

        # Create the second page
        second_webring = Webring.objects.create(profile=self.subscribed_user.profile, title="Second Ring")
        self.assertEqual(second_webring.primary, False)

        # Set the second page as primary
        second_webring.primary = True
        second_webring.save()

        # Refresh the first page from the database
        first_webring.refresh_from_db()
        self.assertEqual(first_webring.primary, False)
