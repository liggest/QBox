from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from .views import qbcore

from .QBoxCore.core import util
from .QBoxCore.message import messager,response


class WsConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self): #请求连接时
        #self.scope 类似于request
        uid=util.getUserKey(self.scope,isScope=True)
        bid=self.scope["url_route"]["kwargs"]["bid"]
        wsbox=qbcore.getUser(self.scope,isScope=True).getBox(bid)
        if wsbox:
            if hasattr(wsbox,"websocket"):
                await wsbox.websocket.close(code=9999) #自定义的code 代表被挤下去了
            wsbox.update(**{"websocket":self})
            #setattr(wsbox,"websocket",self)
            self.box=wsbox
            print("与",uid,"的",wsbox.name,"框连接了")
            await self.accept() #接受连接
            if self.scope["user"].is_authenticated:
                hellotext="你好呀，%s\n有什么可以帮忙的吗？"%uid
            else:
                hellotext="你好呀，陌生人\n有什么可以帮忙的吗？"
            mobj=messager.getMsg( messager.getTextContent(hellotext) )
            await self.send_json(messager.getWsMessage(mobj))
        else:
            #后端未知的连接，连上之后尝试让前端刷新
            await self.accept()
            await self.send_json(messager.getWsMessage(".refresh","cmd"))
            await self.close()

    async def disconnect(self, close_code): #连接关闭时
        pass
 
    async def receive_json(self,content):
        if content["wsMsgType"]=="msg":
            print("来自",self.box.name,"的消息：")
            mobj=content["wsMsg"]
            print(mobj)
            remsgs,recmds=response.processMessages(mobj)
            if recmds!="":
                await self.send_json(messager.getWsMessage(recmds,"cmd"))
            for text in remsgs:
                await self.send_json(messager.getWsMessage( messager.getMsg( messager.getTextContent(text) ) ))
            '''
            if mobj["type"]==1:
                #mobj["type"]=0
                #await self.send_json(content)
                first=mobj["content"][0]
                if first["type"]=="t":
                    if first["value"]=="登录":
                        await self.send_json(messager.getWsMessage(".login","cmd"))
            '''
                
                        
        elif content["wsMsgType"]=="heartbeat": #心跳
            content["wsMsg"]="下"
            #print("收到了来自",self.box.name,"的心跳")
            await self.send_json(content)

        elif content["wsMsgType"]=="cmd":
            recmds=response.processCommands(content["wsMsg"])
            if recmds!="":
                await self.send_json(messager.getWsMessage(recmds,"cmd"))
            pass #收到了指令

    '''
    def receive(self, text_data): #收到消息时
        mobj=json.loads(text_data)
        print(mobj)
        #text_data
        pass

    def task_message(self, event): #自定义的消息处理函数
        #event['message']
        pass
    '''
