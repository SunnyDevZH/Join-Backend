from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views  # Django's built-in auth views
from tasks import views as task_views
from contact import views as contact_views
from categories import views as category_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Contacts Endpoints
    path('api/contacts/', contact_views.contacts, name='contacts'),
    path('api/contacts/<int:id>/', contact_views.contact_detail, name='contact-detail'),
    
    # Tasks Endpoints
    path('api/tasks/', task_views.tasks_list, name='tasks'),  # GET und POST für alle Aufgaben
    path('api/tasks/<int:task_id>/', task_views.task_detail, name='task_detail'),  # GET, DELETE für eine bestimmte Aufgabe

    # Categories Endpoints
    path('api/categories/', category_views.categories, name='categories'),


    ]
