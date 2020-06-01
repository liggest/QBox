from .commandParser import CommandParser
#from .commandTest import pklpath
from . import messager
from django.core.cache import cache
from django_redis import get_redis_connection
import pickle

def processCommands(cmds):
    cmds=cmds.split("\n")
    recmds=[]
    for cmd in cmds:
        cp=CommandParser()
        if cp.getCommand(cmds):
            recmds+=basicCommand(cp)
    return "\n".join(recmds)

def basicCommand(cp:CommandParser):
    cmd=cp.command["command"]
    recmds=[]
    if cmd=="":
        pass
    elif cmd in ["a","b","c"]:
        pass
    return recmds

def fillParams(cmds:str,params):
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