from django.db import models

class Task(models.Model):
    step = models.CharField(max_length=255)  # "col-01"
    title = models.CharField(max_length=255)  # "test"
    description = models.TextField()  # "test"
    assigned_contact = models.JSONField(default=list, blank=True)  # ["Yannick Vaterlaus"]
    contact_color = models.JSONField(default=list, blank=True)  # ["#D43F72"]
    date = models.DateField()  # "2024-11-22"
    prio = models.JSONField(default=list, blank=True)  # ["MEDIUM", "./icons/priority_medium.svg"]
    category = models.CharField(max_length=255)  # "Efsesf"
    category_color = models.CharField(max_length=7)  # "#8843F7"
    subtasks = models.JSONField(default=list, blank=True)  # [{value: 'test', imageSrc: './icons/checkbutton_checked.svg', status: true}]

    def __str__(self):
        return self.title