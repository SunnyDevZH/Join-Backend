from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer

# View für Abrufen und Erstellen
@api_view(['GET', 'POST'])
def tasks_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View für Löschen einer spezifischen Aufgabe
@api_view(['GET', 'DELETE'])
def task_detail(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(
            {"error": f"Task with ID {task_id} does not exist."},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    if request.method == 'DELETE':
        task.delete()
        return Response(
            {"message": f"Task with ID {task_id} has been deleted."},
            status=status.HTTP_200_OK
        )
