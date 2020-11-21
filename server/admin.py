from django.contrib import admin

from server.models import Room, Message, Game

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'updated')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'created')

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    pass