from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    color = models.CharField(max_length=7)  # Hex-Farbcodes, z. B. #FF5733

    def __str__(self):
        return self.name