from django.shortcuts import render


# from django.db.models import Q
# from webrings.models import Webring, Page, WebringPageLink

# webring = Webring.objects.get(id=1) 
# query = Page.objects.filter(
#     # Include primary pages from all accounts
#     Q(webrings=webring, primary=True) |
#     # Include non-primary pages of subscribed accounts.
#     Q(id__in=WebringPageLink.objects.filter(
#         webring=webring, page__account__account_type='subscriber'
#     ).values('page_id'))
# ).distinct()