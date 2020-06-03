# Generated by Django 3.0.3 on 2020-06-03 05:35

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserBoxObj',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.CharField(blank=True, max_length=100, verbose_name='userid')),
                ('name', models.CharField(blank=True, max_length=100, verbose_name='name')),
                ('box', jsonfield.fields.JSONField(default=dict)),
                ('savetime', models.DateTimeField(auto_now=True, verbose_name='save time')),
            ],
        ),
    ]
