from django.contrib import admin
from django.urls import path, include

import server.user.forms # urls via unrest.urls + unrest.schema.register

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('social_django.urls', namespace='social')),
    path('', include('unrest.urls')),
]
