from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    userId = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    userName = models.CharField('userName', max_length=128, blank=True)
    telephone = models.CharField('Telephone', max_length=50, blank=True)
    mod_date = models.DateTimeField('Last modified', auto_now=True)

class Meta:
     verbose_name = 'User Profile'


def __str__(self):
     return self.user.__str__()
