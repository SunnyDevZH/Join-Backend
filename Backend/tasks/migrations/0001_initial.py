# Generated by Django 5.1.1 on 2024-11-15 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('step', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('assigned_contact', models.JSONField(default=dict)),
                ('contact_color', models.JSONField()),
                ('date', models.DateField()),
                ('prio', models.JSONField()),
                ('category', models.CharField(default='general', max_length=100)),
                ('category_color', models.CharField(max_length=7)),
                ('subtasks', models.JSONField()),
            ],
        ),
    ]