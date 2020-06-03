from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from .models import UserProfile
from django.contrib import auth
from .forms import RegistrationForm, LoginForm
from django.http import HttpResponseRedirect,JsonResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.clickjacking import xframe_options_sameorigin
from QBox.views import qbcore
from QBox.QBoxCore.core import util

@xframe_options_sameorigin
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            #nicheng = form.changed_data['nicheng']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password2']
            # 使用内置User自带create_user方法创建用户，不需要使用save()
            user = User.objects.create_user(username=username, password=password, email=email)
            # 如果直接使用objects.create()方法后不需要使用save()
            user_profile = UserProfile(userId=user)
            user_profile.save()
            return HttpResponseRedirect("/accounts/login/")
    else:
        form = RegistrationForm()

    return render(request, 'registration.html', {'form': form})

@xframe_options_sameorigin
def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            uid=util.getUserKey(request)
            auth.login(request, user)
            if qbcore.transferUser(uid,request):
                newuid=util.getUserKey(request)
                qbcore.getUserFromID(newuid).trySend("%s\n欢迎回来~"%str(newuid))
            #return HttpResponseRedirect("/")
            return render(request, 'login.html', {'form': None})
        else:
            return render(request, 'login.html', {'form': form, 'message': '密码错误，请重试'})
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})



@xframe_options_sameorigin
@login_required
def logout(request):
    uid=util.getUserKey(request)
    auth.logout(request)
    qbcore.transferUser(uid,request)
    form = LoginForm()
    return render(request, 'login.html', {'form': form})
    #return HttpResponseRedirect("/")


def islogin(request):
    if request.user.is_authenticated:
        return JsonResponse({"islogin":True})
    return JsonResponse({"islogin":False})