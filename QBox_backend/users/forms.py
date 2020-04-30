from django import forms
from django.contrib.auth.models import User
import re

#验证邮箱是否符合格式
def email_check(email):
    pattern = re.compile(r"\"?([-a-zA-Z0-9.`?{}]+@\w+\.\w+)\"?")
    return re.match(pattern, email)


#用户注册表
class RegistrationForm(forms.Form):
    username = forms.CharField(label='用户名', max_length=50)
    #nicheng = forms.CharField(label='昵称')
    email = forms.EmailField(label='邮箱',)
    password1 = forms.CharField(label='输入密码', widget=forms.PasswordInput)
    password2 = forms.CharField(label='确认密码', widget=forms.PasswordInput)


#判断用户名是否唯一
    def clean_username(self):
        username = self.cleaned_data.get('username')
        filter_result = User.objects.filter(username__exact=username)
        if len(filter_result) > 0:
            raise forms.ValidationError("用户名已存在")
        return username


#判断邮箱是否正确
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email_check(email):
            filter_result = User.objects.filter(email__exact=email)
        if len(filter_result) > 0:
            raise forms.ValidationError("邮箱已注册")
        else:
            raise forms.ValidationError("请输入一个正确的邮箱")
        return email

#判断密码长度是否合适
    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if len(password1) < 6:
            raise forms.ValidationError("密码至少需要6个字符")
        return password1


#判断注册时两次密码是否一致
    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("两次密码不一致，请重新输入")
        return password2


#登录用户表
class LoginForm(forms.Form):
    username = forms.CharField(label='用户名', max_length=50)
    password = forms.CharField(label='密码', widget=forms.PasswordInput)

#判断用户名是否存在
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if email_check(username):
            filter_result = User.objects.filter(email__exact=username)
            if not filter_result:
                raise forms.ValidationError("邮箱不存在")
            else:
                filter_result = User.objects.filter(username__exact=username)
                if not filter_result:
                    raise forms.ValidationError("用户名不存在，请先注册")
        return username
