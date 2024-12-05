from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(['POST'])
def register_or_login(request):
    if request.method == 'POST':
        # Nutzdaten abrufen
        data = request.data
        print(data)  # Debugging: Die empfangenen Daten ausgeben
        
        username = data.get('names')  # 'names' statt 'username'
        email = data.get('email')
        password = data.get('password')
        color = data.get('color')  # Hole den Wert für 'color'

        # Überprüfen, ob alle erforderlichen Felder ausgefüllt sind
        if not username or not email or not password:
            return Response({"error": "Alle Felder sind erforderlich."}, status=status.HTTP_400_BAD_REQUEST)

        # Überprüfen, ob der Benutzername bereits existiert
        if User.objects.filter(username=username).exists():
            # Versuche, den Benutzer anzumelden
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return Response({"message": "Login erfolgreich!", "color": color}, status=status.HTTP_200_OK)
            else:
                # Benutzer existiert, aber falsches Passwort
                return Response({"error": "Benutzername existiert, aber das Passwort ist falsch."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Benutzer registrieren, wenn er nicht existiert
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            # Optional: Farbe als Attribut des Benutzers speichern, falls erforderlich
            return Response({"message": "Registrierung erfolgreich!", "color": color}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Wenn die Anfrage keine POST-Methode ist
    return Response({"error": "Nur POST-Anfragen erlaubt."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
