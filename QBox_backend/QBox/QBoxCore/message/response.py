from .commandParser import CommandParser
#from .commandTest import pklpath
from . import messager
from .module.google_translatation import gTranslator
from django.core.cache import cache
from django_redis import get_redis_connection
import pickle

import requests

from QBox.views import qbcore

async def processCommands(cmds,nodeals=False):
    if isinstance(cmds,str):
        cmds=cmds.split("\n")
    recmds=[]
    nodeals=[]
    for cmd in cmds:
        cp=CommandParser()
        if cp.getCommand(cmd):
            print("处理指令：",cmd)
            result,handled=await basicCommand(cp)
            if result:
                recmds+=result
            if not handled:
                nodeals.append(cmd)
    if nodeals:
        return "\n".join(nodeals+recmds)
    return "\n".join(recmds)

async def basicCommand(cp:CommandParser):
    cmd=cp.command["command"]
    recmds=[]
    handled=True
    if cmd=="send":
        cp.opt("-user",1).opt(["-qq","-group"],1).parse()
        user=cp.command.get("user",None)
        qq=cp.command.get("qq",None)
        group=cp.command.get("group",None)
        if not user and not (qq or group):
            #recmds.append(cp.raw)
            handled=False
        else:
            text=cp.getParams()
            if user:
                quser=qbcore.getUserFromID(user)
                if quser:
                    if await quser.trySendAsync(text):
                        recmds.append(".send 发送成功")
                    else:
                        recmds.append(".send 发送失败…")
            if qq:
                sendQQ(text,qq,"user")
            if group:
                sendQQ(text,group,"group")
    elif cmd=="version":
        recmds.append(".send 求框-QBox-<br>~alpha2.0~")
    elif cmd in ["translate","ts"]:
        cp.opt("-from",1).opt("-to",1).opt("-p",0).opt("-d",0).opt("-donly",0).parse()
        text=cp.getParams()
        if(text.strip()==""):
            recmds.append(".send 给点东西让我翻译嘛")
        a=gTranslator()
        donly=cp.command.get("donly",None)
        if donly:
            result=" ".join( a.detectonly(text) )
            recmds.append(".send %s"%result )
        else:
            fromlan=cp.command.get("from","auto")
            tolan=cp.command.get("to","en")
            poun=cp.command.get("p",None)
            dtct=cp.getByType("d",None)
            result="<br>".join(a.trans(text,fromlan=fromlan,tolan=tolan,poun=poun,detect=dtct or donly))
            recmds.append(".send %s"%result )
    else:
        handled=False
    return recmds,handled

def countParams(cmds:str):
    fidx=cmds.find("{")
    pcount=0
    cmdl=len(cmds)
    while fidx>=0:
        if fidx==0 or cmds[fidx-1]!="{":
            fidx+=1
            if fidx<cmdl:
                if cmds[fidx]=="}": #{}
                    pcount+=1
                elif cmds[fidx].isnumeric():
                    fidx+=1
                    if fidx<cmdl and cmds[fidx]=="}": #{%d}
                        pcount+=1
        fidx=cmds.find("{",fidx+1)
    return pcount

def fillParams(cmds:str,params):
    pcount=countParams(cmds)
    plen=len(params)
    delta=pcount-plen
    if delta>0:
        params+=[""]*delta
    return (cmds.format(*params)).strip()

def text2Commands(text):
    recmds=""
    if not text:
        return recmds
    tlist=text.split()
    conn=get_redis_connection()
    cmds=conn.hget("cmdmaps",tlist[0])
    if cmds:
        cmds=cmds.decode()
        recmds=fillParams(cmds,tlist[1:])
    return recmds

def processMessages(mobj):
    remsgs=[]
    recmds=""
    if mobj["type"]==1:
        text=messager.getTextFromMobj(mobj)
        if text=="":
            return remsgs,recmds
        recmds=text2Commands(text)
    return remsgs,recmds

def sendQQ(text,qq,mtype):
    header_dict = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',"Content-Type": "application/json"}
    params = {"message":text}
    params[mtype+"_id"]=qq
    url=r"http://47.94.214.137:5700/send_msg"
    return requests.get(url,params=params)


def loadAndCache():
    '''
        读取cmdmap.pkl，存入redis
    '''
    cmdmaps=None
    with open(r"QBox/QBoxCore/message/cmdmap.pkl","rb") as f:
        cmdmaps=pickle.load(f)
    if cmdmaps:
        conn=get_redis_connection()
        conn.hmset("cmdmaps",cmdmaps)
        #print(conn.hget("cmdmaps","登录"))
    print("cmdmaps加载完毕~")

#loadAndCache()