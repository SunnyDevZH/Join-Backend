from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        # Hier geben wir alle Felder an, ohne sie einzeln zu listen
        fields = '__all__'