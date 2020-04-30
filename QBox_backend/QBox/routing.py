from django.urls import path,re_path
from . import consumers


websocket_urlpatterns = [
    re_path(r'box/ws/(?P<bid>\d+)/$', consumers.WsConsumer),
    #path("box/ws/",consumers.WsConsumer),
]