from django.contrib import admin
from django.urls import path, include

from server.views import room, message_room
import server.user.forms # urls via unrest.urls + unrest.schema.register

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/room/', room),
    path('api/room/message/', message_room),
    path('', include('social_django.urls', namespace='social')),
    path('', include('unrest.urls')),
]
