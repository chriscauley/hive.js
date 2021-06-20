# Generated by Django 3.1 on 2021-04-11 14:26
from django.conf import settings
from django.db import migrations

def populate_users(apps, schema_editor):
    Room = apps.get_model('server.Room')
    User = apps.get_model(settings.AUTH_USER_MODEL)
    for room in Room.objects.all():
        host = User.objects.filter(username=room.name).first()
        if not host:
            room.delete()
            continue
        room.state['host_id'] = host.id
        for user_id in room.state.pop('user_ids', []):
            room.users.add(User.objects.get(id=user_id))
        room.save()


def depopulate_users(apps, schema_editor):
    Room = apps.get_model('server.Room')
    User = apps.get_model(settings.AUTH_USER_MODEL)
    for room in Room.objects.all():
        room.name = user.username
        room.state['user_ids'] = [u.id for u in room.users.all()]
        room.save()


class Migration(migrations.Migration):
    dependencies = [
        ('server', '0005_auto_20210411_1426'),
    ]

    operations = [
        migrations.RunPython(populate_users, depopulate_users)
    ]
