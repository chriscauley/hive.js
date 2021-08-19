# Generated by Django 3.2.5 on 2021-08-19 10:57

from django.db import migrations
import json

def substitute(name1, name2):
    def action(apps, schema_editor):
        Game = apps.get_model('server', 'game')
        Room = apps.get_model('server', 'room')
        names = ['wasp', 'hornet', 'emerald_wasp']
        for model in [Game, Room]:
            print(f'\n\nReplacing "{name1}" with "{name2}" in all {model.__name__}.state')
            before = {}
            for name in names:
                before[name] = model.objects.filter(state__icontains=name).count()
            for obj in model.objects.filter(state__icontains=name1):
                string = json.dumps(obj.state).replace(f'"{name1}"', f'"{name2}"')
                obj.state = json.loads(string)
                obj.save()
            for name in names:
                after = model.objects.filter(state__icontains=name).count()
                print(f'{name} before/after: {before[name]}/{after}')
    return action


class Migration(migrations.Migration):
    dependencies = [
        ('server', '0007_auto_20210411_1453'),
    ]

    operations = [
        migrations.RunPython(
            substitute('wasp', 'hornet'),
            substitute('hornet', 'wasp')
        )
    ]
