from django.urls import path
from . import consumers


websocket_urlpatterns = [
    path("box/ws/",consumers.WsConsumer),
]