from django.shortcuts import render
from django.http import HttpResponse,JsonResponse,HttpResponseNotModified,HttpResponseNotAllowed
from QBox_backend.settings import BASE_DIR
from django.views.decorators.csrf import csrf_exempt
import os
import hmac
from datetime import datetime

from .QBoxCore.Box import Box,boxdata
from .QBoxCore.core import core,util
from .QBoxCore.quser import quser

qbcore=core.core()


# Create your views here.
def MainPage(request):
    if request.method=="GET":
        return render(request,"index_clear.html")
    return HttpResponse("这里什么都没有",status=405)

def boxInit(request):
    if request.method=="GET":
        width=int(request.GET.get("width",1920) )
        height=int(request.GET.get("height",1080) )
        #request.session["init_time"]= str(datetime.now())
        uid=util.getUserKey(request)
        user=qbcore.createUser(uid)
        user.screenSize=(width,height)
        print("初始化用户",uid)
        request.GET["boxtype"]="chatbox"
        data={}
        data["size"]=[int(width*0.625),int(height*0.625)]
        data["position"]=[int(width/2-size[0]/2),int(height*0.02)]
        request.GET["data"]=data
        return getInnerBox(request)
    return JsonResponse({},status=405)
    

def getInnerBox(request):
    if request.method=="GET":
        bt = request.GET.get("boxtype",None)
        data = request.GET.get("data",{})
        if bt:
            bt,data=boxdata.updateByDefault(bt,data)
            boxobj=util.getBoxObj(request,bt,data)
            boxobj["boxName"]=data.get("boxName",None)
            boxobj["size"]=data.get("size",(200,200))
            boxobj["position"]=data.get("position",(20,20))
            #boxobj["size"]=[320,500]
            return JsonResponse(boxobj)
    return JsonResponse({},status=405)

@csrf_exempt
def userExit(request):
    if request.method=="POST": #Bacon需要使用POST方法
        if request.user.is_authenticated:
            #应该做点啥
            pass
        qbcore.deleteUser(request)
        print("处理",util.getUserKey(request),"的后事")
    return HttpResponse("",status=405)

#@csrf_exempt
def registerBox(request):
    if request.method=="POST":
        nb=Box.Box.getBoxFromRequestData(request.POST)
        if qbcore.getUser(request).addBox(nb):
            print("注册了框",nb.name)
            #print(qbcore.getUser(request).boxes)
            return HttpResponse("添加了框~")
    return HttpResponse("并没有做什么",status=405)

def updateBox(request,bid):
    if request.method=="POST":
        #bid=data["id"]
        box=qbcore.getUser(request).getBox(bid)
        if not box:
            return HttpResponse("并没有做什么")
        data = request.POST.get("data",None)
        if not boxdata.checkData(data,data.keys()):
            return HttpResponse("并没有做什么")
        box.update(data)
        return HttpResponse("更新了框")
    return HttpResponse("并没有做什么",status=405)
        
def removeBox(request,bid):
    if request.method=="POST":
        if qbcore.getUser(request).deleteBox(bid):
            return HttpResponse("删除了框")
    return HttpResponse("并没有做什么",status=405)


'''
def getWebSocket(request,bid):
    print("ws")
    if request.is_websocket():
        wsbox=qbcore.getUser(request).getBox(bid)
        if wsbox:
            if hasattr(wsbox,"websocket"):
                print(wsbox.websocket)
                print(request.websocket)
                print(wsbox.websocket==request.websocket)
            else:
                ws.websocket=request.websocket
'''

