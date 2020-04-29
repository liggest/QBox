from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

class WsConsumer(WebsocketConsumer):
    def connect(self): #请求连接时
        #self.scope 类似于request
        print("connect")
        self.accept()

    def disconnect(self, close_code): #连接关闭时
        print("close")
        pass

    def receive(self, text_data): #收到消息时
        #text_data
        print("receive")
        pass

    def task_message(self, event): #自定义的消息处理函数
        #event['message']
        pass

