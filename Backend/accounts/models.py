from django.db import models  # Hier importierst du 'models'

class User(models.Model):
    username = models.CharField(max_length=100, unique=True, default='default_username')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    color = models.CharField(max_length=7)

    def __str__(self):
        return self.username
