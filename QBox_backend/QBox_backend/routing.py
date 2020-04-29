from channels.routing import ProtocolTypeRouter,URLRouter
from channels.auth import AuthMiddlewareStack
#from django.urls import path,include
import QBox.routing

application = ProtocolTypeRouter({
    #不需要手动添加http协议
    'websocket': AuthMiddlewareStack( #接入了登录系统
        URLRouter(
            QBox.routing.websocket_urlpatterns
        )
    ),
})

 