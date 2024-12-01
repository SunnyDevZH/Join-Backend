from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User  # Das User-Modell importieren
import json

@csrf_exempt  # Nur zum Testen - CSRF in der Produktion absichern
def register_or_login(request):
    if request.method == 'POST':
        # Verarbeite POST-Anfragen (Registrierung)
        try:
            data = json.loads(request.body)  # JSON-Daten des Requests parsen
            names = data.get('names')
            email = data.get('email')
            password = data.get('password')
            color = data.get('color')  # Optional, aber wenn du Farben verwenden möchtest

            if not names or not email or not password:
                return JsonResponse({"error": "Alle Felder sind erforderlich."}, status=400)

            # Benutzer erstellen (hier das Passwort muss in ein gehashtes Passwort umgewandelt werden)
            user = User.objects.create_user(username=email, email=email, password=password)

            return JsonResponse({"message": "Benutzer erfolgreich registriert!"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Ungültige JSON-Daten."}, status=400)
    
    elif request.method == 'GET':
        # Verarbeite GET-Anfragen (z. B. Benutzerdaten abfragen)
        # Alle Benutzer aus der Datenbank abfragen
        users = User.objects.all()  # Alle Benutzer abrufen

        # Optionale Datenformatierung, z.B. nur username und email zurückgeben
        user_list = [{"username": user.username, "email": user.email} for user in users]

        return JsonResponse({"users": user_list}, status=200)
    
    # Fallback für ungültige Methoden (nicht POST oder GET)
    return JsonResponse({"error": "Nur POST- oder GET-Anfragen werden unterstützt."}, status=400)
