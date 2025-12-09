# backend/files/utils.py
# COMPLETE UTILITY FUNCTIONS FOR FILE MANAGEMENT

import os
import secrets
import string
import mimetypes
from cryptography.fernet import Fernet
from django.conf import settings


# ============================================================================
# PASSWORD GENERATION
# ============================================================================

def generate_secure_password(length=8):
    """
    Generate secure alphanumeric password.
    
    Args:
        length (int): Length of password (default: 8)
    
    Returns:
        str: Random alphanumeric password (lowercase letters + digits)
    
    Example:
        >>> generate_secure_password()
        'swift2024'
    """
    alphabet = string.ascii_lowercase + string.digits
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password


# ============================================================================
# FILE ENCRYPTION
# ============================================================================

def generate_encryption_key():
    """
    Generate encryption key for file.
    
    Returns:
        bytes: Fernet encryption key
    """
    return Fernet.generate_key()


def encrypt_file_content(content, key):
    """
    Encrypt file content using Fernet symmetric encryption.
    
    Args:
        content (bytes): File content to encrypt
        key (bytes): Encryption key
    
    Returns:
        bytes: Encrypted content
    """
    fernet = Fernet(key)
    return fernet.encrypt(content)


def decrypt_file_content(encrypted_content, key):
    """
    Decrypt file content using Fernet symmetric encryption.
    
    Args:
        encrypted_content (bytes): Encrypted content
        key (bytes): Encryption key
    
    Returns:
        bytes: Decrypted content
    """
    fernet = Fernet(key)
    return fernet.decrypt(encrypted_content)


# ============================================================================
# FILE TYPE & MIME TYPE
# ============================================================================

def get_file_mime_type(filename):
    """
    Get MIME type from filename.
    
    Args:
        filename (str): Name of the file
    
    Returns:
        str: MIME type (e.g., 'application/pdf', 'image/jpeg')
    
    Example:
        >>> get_file_mime_type('document.pdf')
        'application/pdf'
    """
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type or 'application/octet-stream'


def get_file_extension(filename):
    """
    Get file extension from filename.
    
    Args:
        filename (str): Name of the file
    
    Returns:
        str: File extension (e.g., '.pdf', '.jpg')
    """
    _, ext = os.path.splitext(filename)
    return ext.lower()


# ============================================================================
# FILE SIZE VALIDATION
# ============================================================================

def validate_file_size(file_size):
    """
    Validate file size against limits.
    
    Args:
        file_size (int): File size in bytes
    
    Returns:
        bool: True if valid
    
    Raises:
        ValueError: If file size exceeds 5GB limit
    """
    max_size = 5 * 1024 * 1024 * 1024  # 5GB
    if file_size > max_size:
        raise ValueError("File size exceeds 5GB limit")
    return True


def format_file_size(size_bytes):
    """
    Format file size in bytes to human-readable format.
    
    Args:
        size_bytes (int): File size in bytes
    
    Returns:
        str: Formatted size (e.g., '1.5 GB', '50.0 MB')
    
    Example:
        >>> format_file_size(52428800)
        '50.0 MB'
    """
    if size_bytes == 0:
        return '0 B'
    
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    
    return f"{size_bytes:.1f} PB"


# ============================================================================
# PRICING LOGIC
# ============================================================================

def get_pricing_tier(file_size):
    """
    Get pricing tier based on file size.
    
    Args:
        file_size (int): File size in bytes
    
    Returns:
        tuple: (tier_name, price_in_cents)
            - tier_name (str): 'free', 'premium', or 'large'
            - price_in_cents (int): Price in cents (0, 300, or 800)
    
    Examples:
        >>> get_pricing_tier(50 * 1024 * 1024)  # 50MB
        ('free', 0)
        >>> get_pricing_tier(500 * 1024 * 1024)  # 500MB
        ('premium', 300)
        >>> get_pricing_tier(2 * 1024 * 1024 * 1024)  # 2GB
        ('large', 800)
    """
    mb = file_size / (1024 * 1024)
    gb = file_size / (1024 * 1024 * 1024)
    
    if mb <= 100:
        return 'free', 0
    elif gb <= 1:
        return 'premium', 300  # $3.00
    else:
        return 'large', 800    # $8.00


def calculate_total_pricing(file_sizes):
    """
    Calculate total pricing for multiple files.
    
    Args:
        file_sizes (list): List of file sizes in bytes
    
    Returns:
        dict: Pricing information
            - total_size (int): Total size in bytes
            - tier (str): Pricing tier
            - price (int): Price in cents
            - formatted_size (str): Human-readable size
    """
    total_size = sum(file_sizes)
    tier, price = get_pricing_tier(total_size)
    
    return {
        'total_size': total_size,
        'tier': tier,
        'price': price,
        'formatted_size': format_file_size(total_size)
    }


# ============================================================================
# FILENAME SANITIZATION
# ============================================================================

def sanitize_filename(filename):
    """
    Sanitize filename by removing dangerous characters.
    
    Args:
        filename (str): Original filename
    
    Returns:
        str: Sanitized filename
    """
    # Remove path traversal attempts
    filename = os.path.basename(filename)
    
    # Replace dangerous characters with underscores
    dangerous_chars = ['..', '/', '\\', '<', '>', ':', '"', '|', '?', '*']
    for char in dangerous_chars:
        filename = filename.replace(char, '_')
    
    return filename


def generate_unique_filename(original_filename):
    """
    Generate unique filename using secrets module.
    
    Args:
        original_filename (str): Original filename
    
    Returns:
        str: Unique filename with original extension
    """
    ext = get_file_extension(original_filename)
    unique_id = secrets.token_hex(16)
    return f"{unique_id}{ext}"


# ============================================================================
# FILE PATH GENERATION
# ============================================================================

def get_upload_path(user_id, filename):
    """
    Generate upload path for file.
    
    Args:
        user_id (int): User ID
        filename (str): Filename
    
    Returns:
        str: Upload path (e.g., 'uploads/123/abc123def456.pdf')
    """
    unique_filename = generate_unique_filename(filename)
    return os.path.join('uploads', str(user_id), unique_filename)


# ============================================================================
# VALIDATION HELPERS
# ============================================================================

def validate_filename(filename):
    """
    Validate filename for dangerous patterns.
    
    Args:
        filename (str): Filename to validate
    
    Returns:
        bool: True if valid
    
    Raises:
        ValueError: If filename is invalid
    """
    if not filename or not filename.strip():
        raise ValueError("Filename cannot be empty")
    
    # Check for path traversal
    if '..' in filename or '/' in filename or '\\' in filename:
        raise ValueError("Filename contains path traversal characters")
    
    # Check length
    if len(filename) > 255:
        raise ValueError("Filename too long (max 255 characters)")
    
    return True


def validate_mime_type(mime_type, allowed_types=None):
    """
    Validate MIME type against allowed types.
    
    Args:
        mime_type (str): MIME type to validate
        allowed_types (list): List of allowed MIME types (None = allow all)
    
    Returns:
        bool: True if valid
    
    Raises:
        ValueError: If MIME type not allowed
    """
    if allowed_types is None:
        return True  # Allow all types
    
    if mime_type not in allowed_types:
        raise ValueError(f"MIME type '{mime_type}' not allowed")
    
    return True


# ============================================================================
# STORAGE HELPERS
# ============================================================================

def get_media_path(relative_path):
    """
    Get full media path from relative path.
    
    Args:
        relative_path (str): Relative path from MEDIA_ROOT
    
    Returns:
        str: Full absolute path
    """
    return os.path.join(settings.MEDIA_ROOT, relative_path)


def ensure_upload_directory(user_id):
    """
    Ensure upload directory exists for user.
    
    Args:
        user_id (int): User ID
    
    Returns:
        str: Path to user's upload directory
    """
    upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads', str(user_id))
    os.makedirs(upload_dir, exist_ok=True)
    return upload_dir


# ============================================================================
# EXPIRATION HELPERS
# ============================================================================

def calculate_expiration_date(days=7):
    """
    Calculate expiration date from now.
    
    Args:
        days (int): Number of days until expiration
    
    Returns:
        datetime: Expiration datetime       
    """
    from django.utils import timezone
    from datetime import timedelta
    
    return timezone.now() + timedelta(days=days)


def is_file_expired(expires_at):
    """
    Check if file has expired.
    
    Args:
        expires_at (datetime): Expiration datetime
    
    Returns:
        bool: True if expired
    """
    from django.utils import timezone
    
    return timezone.now() > expires_at