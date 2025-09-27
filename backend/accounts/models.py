from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """
    Custom User model for SecureShare with additional fields
    """
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    
    # Profile information
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    # Storage and usage tracking
    storage_used = models.BigIntegerField(default=0, help_text="Storage used in bytes")
    max_storage = models.BigIntegerField(default=1073741824, help_text="Max storage in bytes (1GB default)")
    
    # Account metadata
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    # Use email as the unique identifier for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    @property
    def storage_percentage(self):
        """Calculate storage usage percentage"""
        if self.max_storage == 0:
            return 0
        return (self.storage_used / self.max_storage) * 100
    
    def can_upload_file(self, file_size):
        """Check if user can upload a file of given size"""
        return (self.storage_used + file_size) <= self.max_storage
    
    def update_storage_used(self, size_change):
        """Update storage used by adding/subtracting size_change"""
        self.storage_used = max(0, self.storage_used + size_change)
        self.save(update_fields=['storage_used'])


class UserSession(models.Model):
    """
    Track user sessions for security purposes
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    last_activity = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'user_sessions'
        ordering = ['-last_activity']
        
    def __str__(self):
        return f"{self.user.email} - {self.ip_address}"