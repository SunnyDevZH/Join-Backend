from django.contrib import admin
from django.urls import path
from contact import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/contacts/', views.contacts, name='contacts'),  # GET und POST für denselben Endpoint
]