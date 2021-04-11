from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from server.models import Room

def room_list(request):
    rooms = Room.objects.filter(public=True, empty=False).select_related('users')
    

def join_room(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    if room.public:
        room.users.add(request.user)
    if request.user not in room.users.all():
        return JsonResponse({}, status=403)
    room.save()
    return JsonResponse(room.to_json())

def new_room(request):
    if not request.method == 'POST':
        return JsonResponse({}, status=405)
    room = Room.objects.create()
    room.users.add(request.user)
    room.state['host_id'] = request.user.id
    room.save()
    return JsonResponse(room.to_json())
