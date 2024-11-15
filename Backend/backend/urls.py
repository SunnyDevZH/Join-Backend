from django.contrib import admin
from django.urls import path
from tasks import views as task_views  # Importiere die Views für Tasks
from contact import views as contact_views  # Falls noch nicht vorhanden

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Contacts Endpoints
    path('api/contacts/', contact_views.contacts, name='contacts'),
    
    
    # Tasks Endpoints
    path('api/tasks/', task_views.tasks, name='tasks'),  # Liste aller Tasks oder neuen Task hinzufügen
    
]