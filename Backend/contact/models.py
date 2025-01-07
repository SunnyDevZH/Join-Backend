from django.db import models

class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    color = models.CharField(max_length=7)
    
    class Meta:
        app_label = 'contact'

    def __str__(self):
        return self.name
    
    