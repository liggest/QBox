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
    "webpagebox":"webpagebox.html",
    "imgbox":"imagebox.html",
    "videobox":"videobox.html",
    "audiobox":"audiobox.html",
    "orderbox":"orderbox.html",
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
        rc=RequestContext(request,data)
        rhtml=t.render(RequestContext(request,{"data":data}))
        boxobj["boxhtml"]=rhtml
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

def getUserKey(request,isScope=False):
    """
        尝试从request得到用户的唯一标识
    """
    if isScope:
        us=request["user"]
        se=request["session"]
    else:
        us=request.user
        se=request.session
    if us.is_authenticated:
        return us.get_username()
    if not se.session_key:
        se.create()
    return se.session_key

