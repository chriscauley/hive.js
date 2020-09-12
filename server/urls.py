from django.contrib import admin
from django.urls import path, include

from server.views import room, message_room

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/room/', room),
    path('api/room/message/', message_room),
    path('', include('unrest.urls')),
]
