from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(['POST'])
def contact_form(request):
    name = request.data.get('name')
    email = request.data.get('email')
    message = request.data.get('message')
    # Hier würdest du die Daten verarbeiten, validieren oder speichern
    return Response({"message": "Vielen Dank für Ihre Nachricht!"}, status=status.HTTP_200_OK)


