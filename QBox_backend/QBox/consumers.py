from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from .views import qbcore

from .QBoxCore.core import util

class WsConsumer(WebsocketConsumer):
    def connect(self): #请求连接时
        #self.scope 类似于request
        uid=util.getUserKey(self.scope,isScope=True)
        bid=int(self.scope["url_route"]["kwargs"]["bid"])
        wsbox=qbcore.getUser(self.scope,isScope=True).getBox(bid)
        print(uid,wsbox)
        if wsbox:
            if hasattr(wsbox,"websocket"):
                wsbox.websocket.close(code=9999) #自定义的code 代表被挤下去了
            setattr(wsbox,"websocket",self)
        self.accept() #接受连接

    def disconnect(self, close_code): #连接关闭时
        pass

    def receive(self, text_data): #收到消息时
        mobj=json.loads(text_data)
        print(mobj)
        #text_data
        pass

    def task_message(self, event): #自定义的消息处理函数
        #event['message']
        pass

