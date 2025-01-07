from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Category
from .serializers import CategorySerializer

@api_view(['GET', 'POST'])
def categories(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        task_categories = request.data.get('taskCategories', [])
        task_colors = request.data.get('taskColors', [])

        if len(task_categories) != len(task_colors):
            return Response({"error": "The number of categories and colors must match."}, status=status.HTTP_400_BAD_REQUEST)

        # Versuche, die Kategorien zu erstellen
        for category, color in zip(task_categories, task_colors):
            # Überprüfen, ob der Name bereits in der Datenbank existiert
            if Category.objects.filter(name=category).exists():
                return Response({"error": f"The category name '{category}' already exists."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                Category.objects.create(name=category, color=color)
            except Exception as e:
                # Fehler abfangen und detaillierte Fehler zurückgeben
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Categories successfully created."}, status=status.HTTP_201_CREATED)
