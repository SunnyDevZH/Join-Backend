from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

@api_view(['POST', 'GET'])
def register_or_login(request):
    if request.method == 'POST':
        # Registrierung oder Login
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({"error": "E-Mail und Passwort sind erforderlich."}, status=status.HTTP_400_BAD_REQUEST)

        # Überprüfen, ob der Benutzer existiert
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Benutzer registrieren
            try:
                user = User.objects.create_user(username=email, email=email, password=password)
                user.save()

                # Token erstellen
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Registrierung erfolgreich!",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh)
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Benutzer authentifizieren
        user = authenticate(request, username=email, password=password)
        if user:
            # Token erstellen
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login erfolgreich!",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Falsches Passwort."}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        # Benutzerdaten nur mit Token abrufen
        if request.user.is_authenticated:
            user = request.user
            return Response({
                "username": user.username,
                "email": user.email,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Authentifizierung erforderlich."}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({"error": "Nur POST und GET-Anfragen erlaubt."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
def guest_token(request):
    # Erstelle einen Dummy-Benutzer für den Gastzugang
    guest_user, created = User.objects.get_or_create(username='guest_user')

    if not guest_user:
        return Response({"error": "Gastbenutzer konnte nicht erstellt werden."}, status=500)

    # Generiere JWT-Token
    refresh = RefreshToken.for_user(guest_user)

    return Response({
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
    })