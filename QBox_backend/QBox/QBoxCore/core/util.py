"""
    一些有用的变量和函数
"""

from django.shortcuts import render
from django.template import Template,Context,RequestContext
import os
from django.conf import settings

#boxtype转文件名
btdict={
    "chatbox":"chatbox.html",
    #"webbox":"chatbox.html",
}

def getBoxObj(request,boxtype,data):
    """
        根据request、boxtype、data，得到一个渲染后的boxobj
    """
    boxobj={}
    boxobj["boxtype"]=boxtype
    fn=btdict.get(boxtype,None)
    if fn:
        t=getBoxHTML(fn)
        t.render(RequestContext(request,data))
        boxobj["boxhtml"]=t.source
    else:
        boxobj["boxhtml"]='<div class="innerbox animated"></div>'
    return boxobj

def getBoxHTML(filename):
    """
        从html文件中得到渲染前的Template
    """
    HTMLtemplate=""
    with open(os.path.join(settings.BASE_DIR,"QBox/templates/boxtemplates/",filename) ,"r",encoding="utf-8") as f:
        HTMLtemplate=f.read()
    t=Template(HTMLtemplate)
    return t

def getUserKey(request):
    """
        尝试从request得到用户的唯一标识
    """
    if request.user.is_authenticated:
        return request.user.get_username()
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key

