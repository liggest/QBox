from django.urls import path,include
from . import views


urlpatterns = [
    #path("",views.MainPage),
    path("init/",views.boxInit),
    path("templates/",views.getInnerBox),
    path("register/",views.registerBox),
    path("update/<int:bid>/",views.updateBox),
    path("remove/<int:bid>/",views.removeBox),
    path("exit/",views.userExit),
    #path("ws/<int:bid>/",views.getWebSocket),
]