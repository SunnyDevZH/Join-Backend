from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list, name='task-list'),  # `/api/tasks/` für GET und POST
    path('<int:task_id>/', views.task_detail, name='task-detail'),  # `/api/tasks/<id>/` für GET, PUT, DELETE
]
