# Generated by Django 3.0.3 on 2020-06-03 03:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserBoxObj',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, verbose_name='name')),
                ('box', jsonfield.fields.JSONField(default=dict)),
                ('savetime', models.DateTimeField(auto_now=True, verbose_name='save time')),
                ('userId', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='boxobj', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
