from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Category

@api_view(['GET', 'POST'])
def categories(request):
    if request.method == 'GET':
        # Kategorien abrufen
        name = request.GET.get('name', None)
        if name:
            categories = Category.objects.filter(name=name)
        else:
            categories = Category.objects.all()

        # Daten direkt als Liste von Diktaten zurückgeben
        category_data = [{"id": cat.id, "name": cat.name, "color": cat.color} for cat in categories]
        return Response(category_data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Neue Kategorie speichern
        name = request.data.get('name')
        color = request.data.get('color')

        if not name or not color:
            return Response({"error": "Name and color are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Kategorie erstellen
        category = Category.objects.create(name=name, color=color)
        return Response({"id": category.id, "name": category.name, "color": category.color}, status=status.HTTP_201_CREATED)
