# accounts/admin.py

from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'color')  # Felder, die in der Admin-Liste angezeigt werden
    search_fields = ('username', 'email')  # Felder, nach denen du im Admin-Bereich suchen kannst
    list_filter = ('color',)  # Filteroptionen im Admin-Bereich
    ordering = ('username',)  # Standard-Sortierung nach Benutzername
    # Damit das Passwort im Admin-Panel bearbeitet werden kann
    readonly_fields = ('password',)  # Passwortfeld ist nur lesbar

admin.site.register(User, UserAdmin)
