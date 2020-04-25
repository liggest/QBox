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
        width=int(request.GET.get("width",1920) )
        height=int(request.GET.get("height",1080) )
        boxobj={}
        boxobj["boxtype"]="chatbox"
        with open(os.path.join(BASE_DIR,"QBox/templates/boxtemplates/chatbox.html") ,"r",encoding="utf-8") as f:
            boxobj["boxhtml"]=f.read()
        size=[int(width*0.625),int(height*0.625)]
        boxobj["size"]=size
        boxobj["position"]=[int(width/2-size[0]/2),int(height*0.02)]
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
                
