from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
  pass


class UserSettings(models.Model):
    """Preferences that follow the account rather than the browser.

    Just the theme for now. `theme` is blank by default, meaning "never
    chosen" -- the client treats an empty value as the server having no
    opinion and keeps whatever is in localStorage. Without that, signing in
    for the first time would overwrite a theme picked while logged out.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='settings',
    )
    theme = models.CharField(max_length=32, blank=True, default='')

    class Meta:
        verbose_name_plural = 'user settings'

    def __str__(self):
        return f'settings for {self.user}'
