from django.contrib import admin
from django.urls import path, include, re_path
from unrest.views import index

import server.user.forms # urls via unrest.urls + unrest.schema.register
from server.views import join_room, new_room

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('social_django.urls', namespace='social')),
    path('', include('unrest.urls')),
    path('api/room/', new_room),
    path('api/room/<room_id>/', join_room),
    re_path('', index),
]
