from django import forms

from .models import UserSettings


class UserSettingsForm(forms.ModelForm):
    """Wired up as UNREST_USER_SETTINGS_FORM.

    unrest_api's settings_view never instantiates this form. It reads
    Meta.model to get_or_create(user=...) the row, and treats Meta.fields
    (minus 'user') as the whitelist of keys it will return on GET and write on
    PUT -- so anything not listed here is silently ignored, which is what stops
    a client PUTing arbitrary columns.
    """

    class Meta:
        model = UserSettings
        fields = ['theme']
