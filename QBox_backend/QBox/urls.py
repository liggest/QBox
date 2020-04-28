from django.urls import path,include
from . import views


urlpatterns = [
    #path("",views.MainPage),
    path("init/",views.boxInit),
    path("templates/",views.getInnerBox),
    path("register/",views.registerBox),
    path("exit/",views.userExit)
]