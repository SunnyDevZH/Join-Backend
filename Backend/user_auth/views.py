from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def register_or_login(request):
    if request.method == 'POST':
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({"error": "E-Mail und Passwort sind erforderlich."}, status=status.HTTP_400_BAD_REQUEST)

        # Überprüfen, ob der Benutzer mit der angegebenen E-Mail existiert
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Benutzer existiert nicht, daher registrieren wir ihn
            try:
                # Benutzer erstellen, wobei die E-Mail als username verwendet wird
                user = User.objects.create_user(username=email, email=email, password=password)
                user.save()

                # Token für den neuen Benutzer erstellen
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Registrierung erfolgreich!",
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh)
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Falls der Benutzer existiert, versuche ihn zu authentifizieren (Login)
        user = authenticate(request, username=email, password=password)  # username ist hier die E-Mail
        if user:
            # Token für den bestehenden Benutzer erstellen
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login erfolgreich!",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh)
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Falsches Passwort."}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"error": "Nur POST-Anfragen erlaubt."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
