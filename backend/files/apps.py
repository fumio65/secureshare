from django.apps import AppConfig


class FilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'files'
    verbose_name = 'File Transfers'
    
    def ready(self):
        """Import signals when app is ready."""
        # Import signals if needed
        pass