from .commandParser import CommandParser
#from .commandTest import pklpath
from . import messager
from django.core.cache import cache
from django_redis import get_redis_connection
import pickle

def processCommands(cmds,nodeals=False):
    cmds=cmds.split("\n")
    recmds=[]
    nodeals=[]
    for cmd in cmds:
        cp=CommandParser()
        if cp.getCommand(cmd):
            print("处理指令：",cmd)
            result=basicCommand(cp)
            if result:
                recmds+=result
            else:
                nodeals.append(cmd)
    if nodeals:
        return "\n".join(nodeals+recmds)
    return "\n".join(recmds)

def basicCommand(cp:CommandParser):
    cmd=cp.command["command"]
    recmds=[]
    if cmd=="":
        pass
    elif cmd in ["a","b","c"]:
        pass
    return recmds

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
    return cmds.format(*params)

def processMessages(mobj):
    remsgs=[]
    recmds=""
    if mobj["type"]==1:
        text=messager.getTextFromMobj(mobj)
        if text=="":
            return remsgs,recmds
        tlist=text.split()
        conn=get_redis_connection()
        cmds=conn.hget("cmdmaps",tlist[0])
        if cmds:
            cmds=cmds.decode()
            recmds=fillParams(cmds,tlist[1:])
    return remsgs,recmds

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

loadAndCache()