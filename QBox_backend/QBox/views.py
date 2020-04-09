from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from QBox_backend.settings import BASE_DIR
import os

# Create your views here.
def MainPage(request):
    if request.method=="GET":
        return render(request,"index_clear.html")

def boxInit(request):
    if request.method=="GET":
        boxobj={}
        boxobj["boxtype"]="chatbox"
        with open(os.path.join(BASE_DIR,"QBox/templates/boxtemplates/chatbox.html") ,"r",encoding="utf-8") as f:
            boxobj["boxhtml"]=f.read()
        return JsonResponse(boxobj)
    

def getInnerBox(request):
    if request.method=="GET":
        bt = request.GET.get("boxtype",None)
        if bt:
            boxobj={}
            boxobj["boxtype"]=bt
            if bt=="chatbox":
                with open(os.path.join(BASE_DIR,"QBox/templates/boxtemplates/chatbox.html") ,"r",encoding="utf-8") as f:
                    boxobj["boxhtml"]=f.read()
            if bt=="cloudmsg":
                with open(os.path.join(BASE_DIR,"QBox/templates/boxtemplates/cloudmsg.html") ,"r",encoding="utf-8") as f:
                    boxobj["boxhtml"]=f.read()
                boxobj["size"]=[320,500]
    return JsonResponse(boxobj)
                
