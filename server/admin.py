from django.contrib import admin
from django.utils.safestring import mark_safe
from collections import defaultdict

from server.models import Room, Message, Game

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'updated')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'created')

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("__str__", 'state_check')
    def state_check(self, obj):
        pieces = defaultdict(lambda: {1:0,2:0})
        for action in obj.state.get('actions'):
            if action[0] != 'place':
                continue
            _, _, type_, player = action
            pieces[type_][player] += 1
        types = []
        rules = obj.state.get('rules', {}).get('pieces')
        if not rules:
            return 'no state.rules.pieces'
        rules['queen'] = rules.get('queen', 1)
        counts = {1:[], 2:[], 'rules': []}
        bad = ''
        for type_ in pieces:
            types.append(type_)
            counts[1].append(pieces[type_][1])
            counts[2].append(pieces[type_][2])
            counts['rules'].append(rules.get(type_,'?'))
            in_rules = rules.get(type_, 0)
            if pieces[type_][1] > in_rules or pieces[type_][2] > in_rules:
                bad = '<div style="background: #FFaaaa">FAIL</div>'
        out = f'{bad} <table><tr>'
        for type_ in types:
            out += f'<th>{type_}</th>'
        out += '</tr><tr>'
        for p1, p2, r in zip(counts[1], counts[2], counts['rules']):
            out += f'<td>{p1} : {p2} / {r}</td>'
        out += '</tr></table>'
        return mark_safe(out)