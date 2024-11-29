from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer

# View für Abrufen und Erstellen von Aufgaben
@api_view(['GET', 'POST'])
def tasks_list(request):
    if request.method == 'GET':
        # Alle Aufgaben abrufen
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        # Neue Aufgabe erstellen
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View für Abrufen, Aktualisieren und Löschen einer spezifischen Aufgabe
@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, task_id):
    try:
        # Aufgabe anhand der ID abrufen
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        # Fehler, wenn Aufgabe nicht existiert
        return Response(
            {"error": f"Task with ID {task_id} does not exist."},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        # Einzelne Aufgabe abrufen
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    if request.method == 'PUT':
        # Bestehende Aufgabe aktualisieren
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()  # Aufgabe überschreiben
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        # Aufgabe löschen
        task.delete()
        return Response(
            {"message": f"Task with ID {task_id} has been deleted."},
            status=status.HTTP_200_OK
        )
