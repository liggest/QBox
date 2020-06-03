from django.urls import path
from . import views

app_name = 'users'
urlpatterns = [
    path("register/", views.register,),
    path("login/", views.login),
    path("login/accounts/logout/", views.logout),
    path("logout/", views.logout),
    path("islogin/",views.islogin),
]