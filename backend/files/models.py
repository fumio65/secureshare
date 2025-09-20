# backend/files/models.py
import os
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

def generate_secure_filename(filename):
    """Generate secure filename with UUID."""
    ext = os.path.splitext(filename)[1]
    return f"{uuid.uuid4().hex}{ext}"

def upload_to_secure_path(instance, filename):
    """Generate secure upload path."""
    secure_filename = generate_secure_filename(filename)
    return f"uploads/{instance.user.id}/{secure_filename}"

class FileUpload(models.Model):
    """Model for file uploads."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
    ]
    
    PRICING_TIER_CHOICES = [
        ('free', 'Free (≤100MB)'),
        ('premium', 'Premium (≤1GB)'),
        ('large', 'Large (≤5GB)'),
    ]
    
    # Basic file information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploads')
    original_filename = models.CharField(max_length=255)
    file_size = models.BigIntegerField()  # in bytes
    mime_type = models.CharField(max_length=100)
    
    # Encrypted file storage
    encrypted_file = models.FileField(upload_to=upload_to_secure_path, null=True, blank=True)
    
    # Security
    download_password = models.CharField(max_length=20)
    download_token = models.UUIDField(default=uuid.uuid4, unique=True)
    
    # Status and pricing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    pricing_tier = models.CharField(max_length=10, choices=PRICING_TIER_CHOICES)
    requires_payment = models.BooleanField(default=False)
    
    # Expiration
    expires_at = models.DateTimeField()
    
    # Statistics
    download_count = models.PositiveIntegerField(default=0)
    last_downloaded = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['download_token']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.original_filename} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        # Set pricing tier based on file size
        if not self.pricing_tier:
            if self.file_size <= 100 * 1024 * 1024:  # 100MB
                self.pricing_tier = 'free'
                self.requires_payment = False
            elif self.file_size <= 1024 * 1024 * 1024:  # 1GB
                self.pricing_tier = 'premium'
                self.requires_payment = True
            else:  # Up to 5GB
                self.pricing_tier = 'large'
                self.requires_payment = True
        
        # Set expiration if not set
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)  # Default 7 days
        
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        """Check if file has expired."""
        return timezone.now() > self.expires_at
    
    @property
    def file_size_mb(self):
        """Get file size in MB."""
        return round(self.file_size / (1024 * 1024), 2)
    
    @property
    def file_size_display(self):
        """Get human-readable file size."""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"
    
    @property
    def download_url(self):
        """Get secure download URL."""
        return f"/api/files/download/{self.download_token}/"
    
    @property
    def pricing_amount(self):
        """Get pricing amount based on tier."""
        pricing_map = {
            'free': 0,
            'premium': 300,  # $3.00 in cents
            'large': 800,    # $8.00 in cents
        }
        return pricing_map.get(self.pricing_tier, 0)


# backend/files/utils.py
import os
import secrets
import string
from cryptography.fernet import Fernet
from django.conf import settings

def generate_secure_password(length=8):
    """Generate secure alphanumeric password."""
    alphabet = string.ascii_lowercase + string.digits
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password

def generate_encryption_key():
    """Generate encryption key for file."""
    return Fernet.generate_key()

def encrypt_file_content(content, key):
    """Encrypt file content using Fernet."""
    fernet = Fernet(key)
    return fernet.encrypt(content)

def decrypt_file_content(encrypted_content, key):
    """Decrypt file content using Fernet."""
    fernet = Fernet(key)
    return fernet.decrypt(encrypted_content)

def get_file_mime_type(filename):
    """Get MIME type from filename."""
    import mimetypes
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type or 'application/octet-stream'

def validate_file_size(file_size):
    """Validate file size against limits."""
    max_size = 5 * 1024 * 1024 * 1024  # 5GB
    if file_size > max_size:
        raise ValueError("File size exceeds 5GB limit")
    return True

def get_pricing_tier(file_size):
    """Get pricing tier based on file size."""
    if file_size <= 100 * 1024 * 1024:  # 100MB
        return 'free', 0
    elif file_size <= 1024 * 1024 * 1024:  # 1GB
        return 'premium', 300  # $3.00
    else:  # Up to 5GB
        return 'large', 800    # $8.00