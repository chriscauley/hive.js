from django.conf import settings
from django.db import models

def default_state():
    return {
        'user_ids': [],
        'afk': [],
        'ready': [],
        'actions': [],
    }

class Room(models.Model):
    state = models.JSONField(default=default_state)
    name = models.CharField(max_length=150) # same length as username

class Message(models.Model):
    action = models.CharField(max_length=64)
    content = models.JSONField(default=dict)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    def to_json(self):
        attrs = ['content', 'user_id', 'created', 'id', 'action']
        return { attr: getattr(self, attr) for attr in attrs }

    class Meta:
        ordering = ('-created',)