from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Contact
from .serializers import ContactSerializer

@api_view(['GET', 'POST'])
def contacts(request):
    if request.method == 'GET':
        # Abfrageparameter aus der Anfrage lesen (optional)
        name = request.GET.get('name', None)
        email = request.GET.get('email', None)
        phone = request.GET.get('phone', None)

        if name and email and phone:
            # Überprüfen, ob ein Kontakt mit den gleichen Werten existiert
            contacts = Contact.objects.filter(name=name, email=email, phone=phone)
        else:
            # Alle Kontakte abrufen, wenn keine Parameter angegeben sind
            contacts = Contact.objects.all()
        
        # Kontakte serialisieren und zurückgeben
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Neuen Kontakt erstellen
        name = request.data.get('name', None)
        email = request.data.get('email', None)
        phone = request.data.get('phone', None)

        # Überprüfen, ob der Kontakt bereits existiert
        if name and email and phone:
            existing_contact = Contact.objects.filter(name=name, email=email, phone=phone).exists()
            if existing_contact:
                return Response({"detail": "Dieser Kontakt existiert bereits."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Wenn der Kontakt nicht existiert, den neuen Kontakt speichern
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def contact_detail(request, id=None):
    try:
        # Holen des spezifischen Kontakts anhand der ID
        contact = Contact.objects.get(id=id)
    except Contact.DoesNotExist:
        return Response({"detail": "Kontakt nicht gefunden"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Den spezifischen Kontakt abrufen
        serializer = ContactSerializer(contact)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        # Den gesamten Kontakt aktualisieren
        serializer = ContactSerializer(contact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Kontakt löschen
        contact.delete()
        return Response({"detail": "Kontakt wurde gelöscht"}, status=status.HTTP_204_NO_CONTENT)
