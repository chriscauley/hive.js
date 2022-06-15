import json
import random

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.utils import timezone
from loguru import logger

from server.models import Room, Message, Game, default_state

def remove(list_, item):
    while item in list_:
        list_.remove(item)

class HiveError(Exception):
    pass

class ChatConsumer(AsyncWebsocketConsumer):
    room_id = None
    async def connect(self):
        if not self.scope['user'].is_authenticated:
            self.send({"close": True})
            return
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = 'chat_%s' % self.room_id

        # Join group (channels)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # application specific
        await self.accept()
        room = await self.get_room()
        if room:
            await self.join_room(room)
            await self.send_room(room)
        else:
            await self.channel_layer.group_send(
                self.room_group_name,
                { 'type': 'all_message', 'message': { 'error': 404 } }
            )

    async def send_room(self, room):
        messages = await self.get_room_messages(room)
        game = await self.get_current_game(room)
        message = {
            'id': room.id,
            'state': room.state,
            'messages': [m.content for m in messages]
        }
        if game:
            message['game_id'] = game.id
            message['game'] = game.state
        await self.channel_layer.group_send(
            self.room_group_name,
            { 'type': 'all_message', 'message': message}
        )

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
        if room:
            if not 'watching' in room.state:
                room.state['watching'] = []
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
        try:
            return Room.objects.get(id=self.room_id)
        except Room.DoesNotExist:
            pass

    @database_sync_to_async
    def join_room(self, room):
        user = self.scope["user"]
        if not user in room.users.all():
            room.users.add(user)
        if not user.id in room.state['user_ids']:
            room.state['user_ids'].append(user.id)
        if user.id != room.state['host_id'] and user.id not in room.state['watching']:
            room.state['player_id'] = user.id
        remove(room.state['afk'], user.id)
        room.save()

    @database_sync_to_async
    def leave_room(self, room):
        room.state['afk'].append(self.scope["user"].id)
        room.save()

    @database_sync_to_async
    def message_room(self, room, data):
        try:
            apply_message(self.scope['user'], room, data)
        except HiveError as e:
            raise NotImplementedError('Email admins')

    @database_sync_to_async
    def get_current_game(self, room):
        return room.get_current_game()

def check_permission(user_id, room, action):
    is_host = user_id == room.state['host_id']
    player_id = room.state.get('player_id')
    if action in ['set_rules', 'start_game', 'kick', 'change_pieces'] and not is_host:
        raise HiveError('Only host can '+action)
    if action == 'sit' and user_id not in [player_id, None]:
        raise HiveError('Cannot sit')
    if action == 'stand' and user_id not in [player_id, room.state['host_id']]:
        raise HiveError('Non player tried to stand')
    if action == 'action' and user_id not in [player_id, room.state['host_id']]:
        raise HiveError('Non player tried to move')

@logger.catch
def apply_message(user, room, data):
    user_id = user.id
    action = data['action']
    content = data.get('content')
    game = room.get_current_game()
    host_id = room.state['host_id']
    player_id = room.state.get('player_id')
    check_permission(user_id, room, action)
    if action == 'set_rules':
        room.state['rules'] = content
    elif action == 'change_pieces':
        game.done = True
        game.save()
    elif action == 'sit':
        room.state['player_id'] = user_id
        remove(room.state['watching'], user_id)
    elif action == 'stand':
        room.state.pop('player_id', None)
        room.state['watching'].append(user_id)
    elif action == 'kick':
        raise NotImplementError('Kick user from room and reset game.')
    elif action == 'action':
        # TODO there was a bug with people resending actions
        # this is a bandaid, but I need to check the error logs (sentry)
        # and validate against hash (replace with node server and run game server side)
        if content.get('action_count') != len(game.state['actions']):
            game.state['actions'].append(content['action'])
            game.save()
    elif action == 'start_game':
        # order will be random or reverse of last game (if there was a winner)
        order = [player_id, host_id]
        random.shuffle(order)
        if game:
            # order = [ game.state['players']['1'], game.state['players']['2'] ]
            # if game.winner:
            #     order.reverse()

            # close out last game
            if game.state.get('actions'):
                game.done = True
                game.save()
            else:
                game.delete()
        game = room.game_set.create()
        players = { '1': order[0], '2': order[1] }
        game.state = { 'players': players, 'rules': room.state['rules'], 'actions': [] }
        game.save()
    elif action == 'chat':
        Message.objects.create(
            room=room,
            content={
                'username': user.username,
                'text': content,
            },
            action=action,
            user=user
        )
    else:
        raise HiveError('Unrecognized action')
    room.save()
