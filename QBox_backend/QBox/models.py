from django.db import models
from django.contrib.auth.models import User
import jsonfield

# Create your models here.
class UserBoxObj(models.Model):
    userId = models.OneToOneField(User,on_delete=models.CASCADE, related_name='boxobj')
    #Django model不支持json文件的存入，查了好久，找到了这个东西
    box = jsonfield.JSONField()
    #box = models.CharField('boxobj',max_length=1000000,blank=True)
    savetime = models.DateTimeField('save time', auto_now=True)

class Meta:
     verbose_name = 'User BoxObj'


def __str__(self):
     return self.user.__str__()
