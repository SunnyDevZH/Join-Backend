# views.py

from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # Zum Testen ohne CSRF-Schutz
def register_or_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Hier extrahierst du die Daten aus der POST-Anfrage
            names = data.get('names')
            email = data.get('email')
            password = data.get('password')
            color = data.get('color')

            if not names or not email or not password:
                return JsonResponse({"error": "Alle Felder sind erforderlich."}, status=400)

            # Weiterverarbeitung hier
            return JsonResponse({"message": "Daten erfolgreich empfangen!"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    # Rückgabe bei nicht-POST-Anfragen
    return JsonResponse({"error": "Nur POST-Anfragen erlaubt."}, status=405)
