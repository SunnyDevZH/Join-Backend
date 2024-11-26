from django.contrib import admin
from django.urls import path
from tasks import views as task_views
from contact import views as contact_views
from categories import views as category_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Contacts Endpoints
    path('api/contacts/', contact_views.contacts, name='contacts'),  # Abrufen und Erstellen von Kontakten
    path('api/contacts/<int:id>/', contact_views.contact_detail, name='contact-detail'),  # Bearbeiten eines spezifischen Kontakts
    
    # Tasks Endpoints
    path('api/tasks/', task_views.tasks, name='tasks'),

    # Tasks Endpoints
    path('api/categories/', category_views.categories, name='categories'),
]