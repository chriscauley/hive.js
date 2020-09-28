import json
import random

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.utils import timezone
from loguru import logger

from server.models import Room, Message

for r in Room.objects.all():
    r.state['user_ids'] = []
    r.state['afk'] = []
    r.state['actions'] = []
    r.save()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope['user'].is_authenticated:
            reply_channel.send({"close": True})
            return
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join group (channels)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # application specific
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
        hour_ago = timezone.now() - timezone.timedelta(0, 2600)
        return list(room.message_set.filter(created__gte=hour_ago))

    @database_sync_to_async
    def get_room(self):
        return Room.objects.get_or_create(name=self.room_name)[0]

    @database_sync_to_async
    def join_room(self, room):
        user_id = str(self.scope["user"].id)
        if not user_id in room.state['user_ids']:
            room.state['user_ids'].append(user_id)
            room.save()

    @database_sync_to_async
    def leave_room(self, room):
        user_id = str(self.scope["user"].id)
        room.state['user_ids'] = [i for i in room.state['user_ids'] if i != user_id]
        room.state['ready'].pop(user_id, None)
        room.save()

    @database_sync_to_async
    def message_room(self, room, data):
        apply_message(self.scope['user'], room, data)

@logger.catch
def apply_message(user, room, data):
    user_id = str(user.id)
    action = data['action']
    content = data.get('content')
    if action == 'setBoard':
        room.state['initial_board'] = content
        room.state.pop('cleared', None)
        room.save()
    elif action == 'ready':
        room.state['ready'][user_id] = content
        user_ids = list(room.state['ready'].keys())
        if len(user_ids) == 2:
            random.shuffle(user_ids)
            # sort in order of white < random < black, which happens to be reverse alphabetical
            # if same, they'll be random, otherwise whoever chose white is first, black second
            user_ids.sort(key=lambda id: room.state['ready'][id])
            room.state['players'] = dict({
                "1": int(user_ids.pop()),
                "2": int(user_ids.pop()),
            })
            m = get_coin_flip_message(room.state['ready'])
            if m:
                Message.objects.create(
                    room=room,
                    content={
                        'text': m,
                        'username': 'admin',
                    },
                    action='system',
                )
        room.save()
    elif action == 'notready':
        room.state['ready'].pop(user_id, None)
        room.save()
    elif action == 'action':
        room.state['actions'].append(content['action'])
        room.save()
    elif action == 'clearBoard':
        room.state['actions'] = []
        room.state['ready'] = {}
        room.state.pop('initial_board', None)
        room.state.pop('players', None)
        room.state['cleared'] = True
        room.save()
    else:
        Message.objects.create(
            room=room,
            content={
                'username': user.username,
                'text': content,
            },
            action=action,
            user=user
        )

def get_coin_flip_message(ready):
    items = list(set(ready.values()))
    if len(items) == 2 or items[0] == 'random':
        # players picked different colors
        id1, id2 = ready.keys()
        User = get_user_model()
        name1 = User.objects.get(id=id1).username
        name2 = User.objects.get(id=id2).username
        return f'{name1} has chosen {ready[id1]} and {name2} has chosen {ready[id2]}.'
    return f'Both players picked {items[0]}. Flipping coing to see who goes first.'