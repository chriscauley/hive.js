from django.conf import settings
from django.db import models

def default_state():
    return {
        'user_ids': [],
        'afk': [],
        'ready': {},
    }

def process_user(user):
    return { 'username': user.username, 'id': user.id }

class Room(models.Model):
    state = models.JSONField(default=default_state)
    updated = models.DateTimeField(auto_now=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    public = models.BooleanField(default=True)
    empty = models.BooleanField(default=False)
    def get_current_game(self):
        return self.game_set.get_or_create(done=False)[0]
    def __str__(self):
        return f'Room #{self.id}'
    def to_json(self):
        return {
            **self.state,
            'id': self.id,
            'public': self.public,
            'users': [process_user(u) for u in self.users.all()]
        }

class Message(models.Model):
    action = models.CharField(max_length=64)
    content = models.JSONField(default=dict)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    def to_json(self):
        attrs = ['content', 'user_id', 'id', 'action']
        return { attr: getattr(self, attr) for attr in attrs }

    def __str__(self):
        return f"{self.user} in {self.room}"
    class Meta:
        ordering = ('created',)

class Game(models.Model):
    def default_state():
        return {
            'actions': [],
            # players will be added once game starts
        }
    def __str__(self):
        return f'{self.room} at {self.created}'
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    done = models.BooleanField(default=False)
    state = models.JSONField(default=default_state)
