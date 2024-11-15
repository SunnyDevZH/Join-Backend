from django.db import models

class Task(models.Model):
    step = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    assigned_contact = models.CharField(max_length=255)
    contact_color = models.CharField(max_length=50)
    date = models.DateField()
    prio = models.CharField(max_length=50)
    category = models.CharField(max_length=255)
    category_color = models.CharField(max_length=7)  # Hex-Farbe
    subtasks = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.title