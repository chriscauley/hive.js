from django import forms
from unrest import schema
from unrest.user.forms import validate_unique

from .models import User

FORBIDDEN_USERNAMES= ['admin', 'general']

@schema.register
class UserSettingsForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        del self.fields['username'].help_text
    def clean_username(self):
        username = self.cleaned_data['username']
        validate_unique('username', username, exclude={'id': self.request.user.id})
        if username in FORBIDDEN_USERNAMES:
            raise forms.ValidationError('That username is already in use.')
        return username
    def clean_email(self):
        email = self.cleaned_data['email']
        if email:
            validate_unique('email', email, exclude={'id': self.request.user.id})
        return email
    def clean(self):
        if self.instance.id != self.request.user.id:
            raise forms.ValidationError("You do not have permission to edit this form.")
        return self.cleaned_data
    class Meta:
        model = User
        fields = ('username', 'email')