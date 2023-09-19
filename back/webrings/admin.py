from django.contrib import admin
from .models import Page, Webring, WebringPageLink, Account

class WebringPageInline(admin.TabularInline):
    model = WebringPageLink
    extra = 1

class PageAdmin(admin.ModelAdmin):
    inlines = (WebringPageInline,)

class WebringAdmin(admin.ModelAdmin):
    inlines = (WebringPageInline,)

admin.site.register(Page, PageAdmin)
admin.site.register(Webring, WebringAdmin)
admin.site.register(WebringPageLink)
admin.site.register(Account)