from django.contrib import admin
from django.urls import path, include

from server.views import room, message_room
import chat.views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/room/', room),
    path('api/room/message/', message_room),
    path('chat/', chat.views.index, name='index'),
    path('chat/<room_name>/', chat.views.room, name='room'),
    path('', include('unrest.urls')),
]
