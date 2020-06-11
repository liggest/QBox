from django.shortcuts import render
from django.db import models
from django.http import HttpResponse,JsonResponse,HttpResponseNotModified,HttpResponseNotAllowed,StreamingHttpResponse
from django.views import View
from QBox_backend.settings import BASE_DIR
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import os
#import hmac
#from datetime import datetime
import json
from asgiref.sync import async_to_sync

from .QBoxCore.Box import Box,boxdata
from .QBoxCore.core import core,util
from .QBoxCore.quser import quser
from .QBoxCore.message import messager,commandParser
from .models import UserBoxObj

qbcore=core.core()

from .QBoxCore.message import response
response.loadAndCache()


# Create your views here.
def MainPage(request):
    if request.method=="GET":
        return render(request,"index_clear.html")
    return HttpResponse("这里什么都没有",status=405)

def userInit(request):
    if request.method=="GET":
        width=int(request.GET.get("width",1920) )
        height=int(request.GET.get("height",1080) )
        #request.session["init_time"]= str(datetime.now())
        uid=util.getUserKey(request)
        user=qbcore.createUser(uid)
        user.screenSize=(width,height)
        print("初始化用户",uid)
        getdata=request.GET.copy()
        getdata["boxtype"]="chatbox"
        data={}
        size=[int(width*0.625),int(height*0.625)]
        data["size"]=size
        data["position"]=[int(width/2-size[0]/2),int(height*0.02)]
        getdata["data"]=json.dumps(data)
        request.GET=getdata
        return getInnerBox(request)
    return JsonResponse({},status=405)
    

def getInnerBox(request):
    if request.method=="GET":
        bt = request.GET.get("boxtype",None)
        data = json.loads( request.GET.get("data",'{}') )
        if bt:
            bt,data=boxdata.updateByDefault(bt,data)
            boxobj=util.getBoxObj(request,bt,data)
            boxobj["boxName"]=data.get("boxName",None)
            boxobj["size"]=data.get("size",(200, 200))
            position=data.get("position",None)
            if not position:
                width=int(request.GET.get("width",1920) )
                height=int(request.GET.get("height",1080) )
                user=qbcore.getUser(request)
                user.screenSize=(width,height)
                (px,py)=boxdata.getNewBoxPosition(user,boxobj["size"])
                if px==-1:
                    px=20
                if py==-1:
                    py=20
                position=(px,py)
            print("position:",position)
            boxobj["position"]=position
            #boxobj["size"]=[320,500]
            return JsonResponse(boxobj)
    return JsonResponse({},status=405)

@csrf_exempt
def userExit(request):
    if request.method=="POST": #Bacon需要使用POST方法
        if request.user.is_authenticated:
            SaveorGetBoxObj(request)
        qbcore.deleteUser(request)
        print("处理",util.getUserKey(request),"的后事")
    return HttpResponse("")

#@csrf_exempt
def registerBox(request):
    if request.method=="POST":
        data = request.POST.get("data",None)
        if data:
            nb=Box.Box.getBoxFromRequestData(json.loads(data))
            if qbcore.getUser(request).addBox(nb):
                print("注册了框",nb.name)
                #print(qbcore.getUser(request).boxes)
                return HttpResponse("添加了框~")
    return HttpResponse("并没有添加什么",status=405)

def updateBox(request,bid):
    if request.method=="POST":
        #bid=data["id"]
        box=qbcore.getUser(request).getBox(bid)
        if not box:
            return HttpResponse("并没有更新什么")
        data = request.POST.get("data",None)
        if data:
            data=json.loads(data)
            if not boxdata.checkData(data,data.keys()):
                print("no check")
                return HttpResponse("并没有更新什么")
            box.update(**data)
            return HttpResponse("更新了框~")
    return HttpResponse("并没有更新什么",status=405)
        
def removeBox(request,bid):
    if request.method=="POST":
        if qbcore.getUser(request).deleteBox(bid):
            return HttpResponse("移除了框~")
    return HttpResponse("并没有移除什么",status=405)

def getStatus(request):
    if request.method=="GET":
        users=request.GET.getlist("user",None)
        if users:
            rl=[]
            for uid in users:
                us=qbcore.getUserFromID(uid)
                if us:
                    rl.append(str(us))
            return HttpResponse("\n".join(rl))            
        return HttpResponse(str(qbcore))
    return HttpResponse("",status=405)

def test(request):
    if qbcore.getUser(request).trySend("测试"):
        return HttpResponse("test")
    return HttpResponse("没法test")


class CommandView(View):

    def get(self,request): #留作指令提示用
        return JsonResponse({})

    def post(self,request):
        cmds=request.POST.get("commands","")
        recmds={"commands":""}
        total=[]
        cmds=cmds.split("\n")
        for cmd in cmds:
            tcmd=response.text2Commands(cmd)
            if tcmd!="":
                total.append(tcmd)
            else:
                total.append(cmd)
        #if commandParser.CommandParser.isCommand(cmds):
        recmds["commands"]= async_to_sync(response.processCommands) (total,nodeals=True)
        return JsonResponse(recmds)

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


'''
将json文件存入数据库，需要有两个参数，一个是uerId,这应该是一个user实例，用request.user应该就可以得到
然后就是box，这个是用来存json文件的
'''
@csrf_exempt
def SaveorGetBoxObj(request):
    #print("进了SoG")
    if request.method == "POST":
        #print("进了POST")
        userId = request.user.username
        if userId:
            name = request.POST.get("name",None) 
            #print("nnnnname",name)
            box = request.POST.get("data",None)
            if not (name and box):
                print("情报不足，未能保存%s的备份"%userId)
                return JsonResponse({"success":False})
            #print("bbbbox",box)
            savetime = timezone.now()
            oldbox = UserBoxObj.objects.values("box").filter(name = name,userId = userId).all()
            if len(oldbox) == 0:
                userboxobj = UserBoxObj(userId = userId, name = name, box = box, savetime = savetime)
                userboxobj.save()
            else:
                userboxobj = UserBoxObj.objects.get(name = name,userId = userId)
                userboxobj.box = box
                userboxobj.savetime = savetime
                userboxobj.save()
            print("保存了%s的备份：%s"%(userId,name))
            return JsonResponse({"success":True})
        else:
            return JsonResponse({"success":False,"reason":"请先登录"})
        #boxx = UserBoxObj.objects.values("box").filter(name=name).last()
        #print("ggggetbox",boxx)
        #print("len(boxxxx)",len(boxx))
    if request.method == "GET":
        name = request.GET.get("name",None)
        if request.user.is_authenticated:
            userId = request.user.username
            if name and userId:
                boxtext = UserBoxObj.objects.values("box").filter(name=name,userId = userId).last()
                #boxes=json.loads( boxtext["box"] )
                #print(boxes)
                return JsonResponse(boxtext)
        return JsonResponse({"success":False})
    return JsonResponse({})


def boxGenerator(boxes):
    for box in boxes:
        yield box
