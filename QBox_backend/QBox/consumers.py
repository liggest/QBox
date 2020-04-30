from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from .views import qbcore

from .QBoxCore.core import util

class WsConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self): #请求连接时
        #self.scope 类似于request
        uid=util.getUserKey(self.scope,isScope=True)
        bid=self.scope["url_route"]["kwargs"]["bid"]
        wsbox=qbcore.getUser(self.scope,isScope=True).getBox(bid)
        if wsbox:
            if hasattr(wsbox,"websocket"):
                await wsbox.websocket.close(code=9999) #自定义的code 代表被挤下去了
            setattr(wsbox,"websocket",self)
            self.box=wsbox
        print("与",uid,"的",wsbox.name,"框连接了")
        await self.accept() #接受连接

    async def disconnect(self, close_code): #连接关闭时
        pass
 
    async def receive_json(self,content):
        if content["wsMsgType"]=="msg":
            print("来自",self.box.name,"的消息：")
            print(content["wsMsg"])
        elif content["wsMsgType"]=="heartbeat":
            content["wsMsg"]="下"
            print("收到了来",self.box.name,"的自心跳")
            await self.send_json(content)

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
