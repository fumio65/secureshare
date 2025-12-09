# backend/files/serializers.py
# COMPLETE FILE WITH ALL SERIALIZERS

from rest_framework import serializers
from .models import FileUpload
from .utils import validate_file_size, get_pricing_tier


# ============================================================================
# MAIN FILE UPLOAD SERIALIZERS
# ============================================================================

class FileUploadSerializer(serializers.ModelSerializer):
    """Serializer for file uploads."""
    
    file_size_display = serializers.ReadOnlyField()
    file_size_mb = serializers.ReadOnlyField()
    pricing_amount = serializers.ReadOnlyField()
    download_url = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = FileUpload
        fields = [
            'id', 'original_filename', 'file_size', 'file_size_mb', 
            'file_size_display', 'mime_type', 'download_password', 
            'download_token', 'status', 'pricing_tier', 'requires_payment',
            'pricing_amount', 'expires_at', 'download_count', 
            'last_downloaded', 'download_url', 'is_expired',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'download_token', 'status', 'pricing_tier', 
            'requires_payment', 'download_count', 'last_downloaded',
            'created_at', 'updated_at'
        ]


class FileUploadCreateSerializer(serializers.Serializer):
    """Serializer for creating file uploads."""
    
    filename = serializers.CharField(max_length=255)
    file_size = serializers.IntegerField(min_value=1)
    mime_type = serializers.CharField(max_length=100, required=False)
    
    def validate_file_size(self, value):
        """Validate file size."""
        validate_file_size(value)
        return value
    
    def validate_filename(self, value):
        """Validate filename."""
        if not value.strip():
            raise serializers.ValidationError("Filename cannot be empty")
        
        # Check for dangerous characters
        dangerous_chars = ['..', '/', '\\', '<', '>', ':', '"', '|', '?', '*']
        for char in dangerous_chars:
            if char in value:
                raise serializers.ValidationError(f"Filename contains invalid character: {char}")
        
        return value


# ============================================================================
# BULK UPLOAD SERIALIZERS (NEW)
# ============================================================================

class BulkFileUploadSerializer(serializers.Serializer):
    """Serializer for bulk file upload creation."""
    
    files = serializers.ListField(
        child=serializers.DictField(),
        min_length=1,
        max_length=5,  # Match frontend max files
        help_text="Array of file objects with filename, file_size, and mime_type"
    )
    
    def validate_files(self, value):
        """Validate bulk files."""
        total_size = 0
        
        for file_data in value:
            # Validate each file has required fields
            if 'filename' not in file_data:
                raise serializers.ValidationError("Each file must have a 'filename'")
            if 'file_size' not in file_data:
                raise serializers.ValidationError("Each file must have a 'file_size'")
            
            # Validate filename
            filename = file_data['filename']
            if not filename.strip():
                raise serializers.ValidationError(f"Filename cannot be empty")
            
            # Check for dangerous characters in filename
            dangerous_chars = ['..', '/', '\\', '<', '>', ':', '"', '|', '?', '*']
            for char in dangerous_chars:
                if char in filename:
                    raise serializers.ValidationError(
                        f"Filename '{filename}' contains invalid character: {char}"
                    )
            
            # Validate file size
            file_size = file_data['file_size']
            if file_size < 1:
                raise serializers.ValidationError(f"Invalid file size for {filename}")
            
            total_size += file_size
        
        # Validate total size (5GB limit)
        max_total = 5 * 1024 * 1024 * 1024
        if total_size > max_total:
            raise serializers.ValidationError(
                f"Total file size ({self._format_size(total_size)}) exceeds 5GB limit"
            )
        
        return value
    
    def _format_size(self, size_bytes):
        """Format bytes to human-readable size."""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.1f} TB"


# ============================================================================
# SHARE LINK SERIALIZER (NEW)
# ============================================================================

class FileShareLinkSerializer(serializers.Serializer):
    """Serializer for file share link information."""
    
    download_link = serializers.SerializerMethodField()
    download_password = serializers.CharField()
    expires_at = serializers.DateTimeField()
    
    def get_download_link(self, obj):
        """Generate full download URL."""
        request = self.context.get('request')
        if request:
            # Get base URL from request
            base_url = f"{request.scheme}://{request.get_host()}"
            return f"{base_url}/download/{obj.download_token}"
        return f"/download/{obj.download_token}"


# ============================================================================
# DOWNLOAD SERIALIZERS
# ============================================================================

class FileDownloadSerializer(serializers.Serializer):
    """Serializer for file download requests."""
    
    password = serializers.CharField(max_length=20)
    
    def validate_password(self, value):
        """Validate download password."""
        if not value.strip():
            raise serializers.ValidationError("Password is required")
        return value