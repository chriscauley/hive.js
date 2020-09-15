import json
import random

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from server.models import Room, Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        room = await self.get_room()
        await self.join_room(room)
        await self.send_room(room)

    async def send_room(self, room):
        messages = await self.get_room_messages(room)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'all_message',
                'message': {
                    'name': room.name,
                    'state': room.state,
                    'messages': [m.content for m in messages]
                }
            })

    async def all_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event['message']))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        room = await self.get_room()
        await self.leave_room(room)
        await self.send_room(room)

    # Receive message from WebSocket
    async def receive(self, text_data):
        room = await self.get_room()
        await self.message_room(room, json.loads(text_data))
        await self.send_room(room)

    @database_sync_to_async
    def get_room_messages(self, room):
        return list(room.message_set.all())

    @database_sync_to_async
    def get_room(self):
        return Room.objects.get_or_create(name=self.room_name)[0]

    @database_sync_to_async
    def join_room(self, room):
        user = self.scope["user"]
        if not user.id in room.state['user_ids']:
            room.state['user_ids'].append(user.id)
            room.save()

    @database_sync_to_async
    def leave_room(self, room):
        user = self.scope["user"]
        room.state['user_ids'] = [i for i in room.state['user_ids'] if i != user.id]
        room.state['ready'] = [i for i in room.state['ready'] if i != user.id]
        room.save()

    @database_sync_to_async
    def message_room(self, room, data):
        user = self.scope["user"]
        action = data['action']
        content = data.get('content')
        if action == 'setBoard':
            room.state['initial_board'] = content
            room.state.pop('cleared', None)
            room.save()
        elif action == 'ready':
            if user.id not in room.state['ready']:
                room.state['ready'].append(user.id)
            user_ids = room.state['ready'][:]
            if len(user_ids) == 2:
                random.shuffle(user_ids)
                room.state['players'] = dict({
                    "1": user_ids.pop(),
                    "2": user_ids.pop(),
                })
            room.save()
        elif action == 'notready':
            room.state['ready'] = [i for i in room.state['ready'] if i != user.id]
            room.save()
        elif action == 'action':
            room.state['actions'].append(content['action'])
            room.save()
        elif action == 'clearBoard':
            room.state['actions'] = []
            room.state['ready'] = []
            room.state.pop('initial_board', None)
            room.state.pop('players', None)
            room.state['cleared'] = True
            room.save()
        else:
            message = Message.objects.create(
                room=room,
                content={
                    'username': user.username,
                    'text': content,
                },
                action=action,
                user=user
            )
