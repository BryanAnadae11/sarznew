from django.apps import AppConfig


class SarznewappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sarznewapp'

    def ready(self):
    	import sarznewapp.signals
