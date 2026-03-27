from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include, re_path

from server.views import join_room, new_room

index = lambda request: HttpResponse(open('dist/index.html').read(), content_type='text/html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('unrest.urls')),
    path('api/room/', new_room),
    path('api/room/<room_id>/', join_room),
    re_path('', index),
]
