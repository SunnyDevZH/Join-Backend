from django.contrib import admin
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'get_access_token')

    def get_access_token(self, obj):
        # Dynamisch einen Token für den Benutzer generieren
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)
    get_access_token.short_description = 'Access Token'

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
