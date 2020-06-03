from django.db import models
from django.contrib.auth.models import User
import jsonfield

# Create your models here.
class UserBoxObj(models.Model):
    userId = models.CharField("userid",max_length=100,blank=True)
    name = models.CharField("name", max_length=100, blank=True)
    #Django model不支持json文件的存入，查了好久，找到了这个东西
    box = jsonfield.JSONField()
    #box = models.CharField('boxobj',max_length=1000000,blank=True)
    savetime = models.DateTimeField('save time', auto_now=True)
    objects = models.Manager()


class Meta:
     verbose_name = 'User BoxObj'


def __str__(self):
     return self.user.__str__()
