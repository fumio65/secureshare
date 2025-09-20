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
