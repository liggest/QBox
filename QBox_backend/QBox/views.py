from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from QBox_backend.settings import BASE_DIR
import os
import hmac
from datetime import datetime

from .QBoxCore.Box import Box
from .QBoxCore.core import core
from .QBoxCore.core import util
from .QBoxCore.quser import quser

qbcore=core.core()


# Create your views here.
def MainPage(request):
    if request.method=="GET":
        return render(request,"index_clear.html")

def boxInit(request):
    if request.method=="GET":
        width=int(request.GET.get("width",1920) )
        height=int(request.GET.get("height",1080) )
        request.session["init_time"]= str(datetime.now())
        uid=util.getUserKey(request)
        qbcore.qusers[uid]=quser.quser()
        print(qbcore.qusers)
        boxobj=util.getBoxObj(request,"chatbox",{})
        size=[int(width*0.625),int(height*0.625)]
        boxobj["size"]=size
        boxobj["position"]=[int(width/2-size[0]/2),int(height*0.02)]
        print("初始化")
        return JsonResponse(boxobj)
    

def getInnerBox(request):
    if request.method=="GET":
        bt = request.GET.get("boxtype",None)
        if bt:
            boxobj=util.getBoxObj(request,bt,{})
            #boxobj["size"]=[320,500]
        return JsonResponse(boxobj)
                
def userExit(request):
    if request.method=="GET":
        if request.user.is_authenticated:
            #应该做点啥
            pass
        uid=util.getUserKey(request)
        del qbcore.qusers[uid]
        print("处理后事")
    return HttpResponse("")
