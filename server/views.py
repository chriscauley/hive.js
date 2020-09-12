import json
from django.http import JsonResponse

from server.models import Room, Message
import random

def RoomResponse(room):
    return JsonResponse({
        'name': room.name,
        'state': room.state,
        'messages': [m.to_json() for m in room.message_set.all()]
    })

def room(request):
    # This doubles as joining a room and refreshing the room via ajax
    # TODO only send data if room has changed
    updated = request.GET.get('updated')
    # TODO should this be locked down in the backend? (prevent arbitrary room names?)
    room, new = Room.objects.get_or_create(name=request.GET['room_name'])
    if not request.user.id in room.state['user_ids']:
        room.state['user_ids'].append(request.user.id)
        room.save()
    return RoomResponse(room)

def message_room(request):
    data = json.loads(request.body.decode('utf-8') or "{}")
    room, new = Room.objects.get_or_create(name=data['room_name'])
    action = data['action']
    content = data.get('content')
    if action == 'setBoard':
        room.state['initial_board'] = content
        room.save()
    elif action == 'ready':
        if request.user.id not in room.state['ready']:
            room.state['ready'].append(request.user.id)
        user_ids = room.state['ready'][:]
        if len(user_ids) == 2:
            random.shuffle(user_ids)
            room.state['players'] = dict({
                1: user_ids.pop(),
                2: user_ids.pop(),
            })
        room.save()
    elif action == 'notready':
        room.state['ready'] = [i for i in room.state['ready'] if i != request.user.id]
        room.save()
    elif action == 'action':
        room.state['actions'].append(content['action'])
        room.save()
    else:
        message = Message.objects.create(
            room=room,
            content=content,
            action=action,
            user=request.user
        )
    return RoomResponse(room)