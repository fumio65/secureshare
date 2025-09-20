# backend/files/serializers.py
from rest_framework import serializers
from .models import FileUpload
from .utils import validate_file_size, get_pricing_tier

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

class FileDownloadSerializer(serializers.Serializer):
    """Serializer for file download requests."""
    
    password = serializers.CharField(max_length=20)
    
    def validate_password(self, value):
        """Validate download password."""
        if not value.strip():
            raise serializers.ValidationError("Password is required")
        return value


# backend/files/views.py
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
from django.utils import timezone
from django.core.files.base import ContentFile
import os

from .models import FileUpload
from .serializers import (
    FileUploadSerializer, 
    FileUploadCreateSerializer, 
    FileDownloadSerializer
)
from .utils import generate_secure_password, get_file_mime_type


class FileUploadListView(generics.ListAPIView):
    """List user's file uploads."""
    
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return user's uploads."""
        return FileUpload.objects.filter(user=self.request.user)


class FileUploadCreateView(generics.CreateAPIView):
    """Create new file upload entry."""
    
    serializer_class = FileUploadCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        """Create new file upload entry."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Extract validated data
        filename = serializer.validated_data['filename']
        file_size = serializer.validated_data['file_size']
        mime_type = serializer.validated_data.get('mime_type') or get_file_mime_type(filename)
        
        # Create file upload entry
        upload = FileUpload.objects.create(
            user=request.user,
            original_filename=filename,
            file_size=file_size,
            mime_type=mime_type,
            download_password=generate_secure_password(),
            status='pending' if file_size > 100 * 1024 * 1024 else 'processing'
        )
        
        return Response(
            FileUploadSerializer(upload).data,
            status=status.HTTP_201_CREATED
        )


class FileUploadDetailView(generics.RetrieveUpdateDestroyAPIView):
    """File upload detail view."""
    
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return user's uploads."""
        return FileUpload.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_upload_view(request, upload_id):
    """Complete file upload after payment (if required)."""
    
    upload = get_object_or_404(
        FileUpload, 
        id=upload_id, 
        user=request.user
    )
    
    # Check if upload requires payment and hasn't been paid
    if upload.requires_payment and upload.status == 'pending':
        # Check if payment exists (will be implemented in payments app)
        from payments.models import Payment
        
        payment_exists = Payment.objects.filter(
            user=request.user,
            file_upload=upload,
            status='completed'
        ).exists()
        
        if not payment_exists:
            return Response(
                {'error': 'Payment required before upload can be completed'},
                status=status.HTTP_402_PAYMENT_REQUIRED
            )
    
    # Update status to completed
    upload.status = 'completed'
    upload.save()
    
    return Response(
        FileUploadSerializer(upload).data,
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def download_info_view(request, download_token):
    """Get download information without password."""
    
    upload = get_object_or_404(
        FileUpload, 
        download_token=download_token,
        status='completed'
    )
    
    # Check if expired
    if upload.is_expired:
        raise Http404("File has expired")
    
    # Return basic file info for download page
    return Response({
        'id': upload.id,
        'filename': upload.original_filename,
        'file_size': upload.file_size,
        'file_size_display': upload.file_size_display,
        'mime_type': upload.mime_type,
        'expires_at': upload.expires_at,
        'download_count': upload.download_count,
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def download_file_view(request, download_token):
    """Download file with password verification."""
    
    upload = get_object_or_404(
        FileUpload, 
        download_token=download_token,
        status='completed'
    )
    
    # Check if expired
    if upload.is_expired:
        return Response(
            {'error': 'File has expired'},
            status=status.HTTP_410_GONE
        )
    
    # Validate password
    serializer = FileDownloadSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    password = serializer.validated_data['password']
    
    if password != upload.download_password:
        return Response(
            {'error': 'Invalid password'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Check if file exists
    if not upload.encrypted_file or not os.path.exists(upload.encrypted_file.path):
        return Response(
            {'error': 'File not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Update download statistics
    upload.download_count += 1
    upload.last_downloaded = timezone.now()
    upload.save()
    
    # Return file
    response = FileResponse(
        upload.encrypted_file.open('rb'),
        as_attachment=True,
        filename=upload.original_filename,
        content_type=upload.mime_type
    )
    
    return response


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_file_content_view(request, upload_id):
    """Upload actual file content."""
    
    upload = get_object_or_404(
        FileUpload, 
        id=upload_id, 
        user=request.user
    )
    
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    uploaded_file = request.FILES['file']
    
    # Validate file size matches
    if uploaded_file.size != upload.file_size:
        return Response(
            {'error': 'File size mismatch'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Save encrypted file (encryption will be handled on frontend)
    upload.encrypted_file.save(
        f"{upload.id}.enc",
        ContentFile(uploaded_file.read()),
        save=True
    )
    
    upload.status = 'completed'
    upload.save()
    
    return Response(
        FileUploadSerializer(upload).data,
        status=status.HTTP_200_OK
    )


# backend/files/urls.py
from django.urls import path
from . import views

app_name = 'files'

urlpatterns = [
    # File management
    path('', views.FileUploadListView.as_view(), name='upload_list'),
    path('create/', views.FileUploadCreateView.as_view(), name='upload_create'),
    path('<uuid:pk>/', views.FileUploadDetailView.as_view(), name='upload_detail'),
    path('<uuid:upload_id>/complete/', views.complete_upload_view, name='complete_upload'),
    path('<uuid:upload_id>/upload/', views.upload_file_content_view, name='upload_content'),
    
    # Download endpoints (public)
    path('download/<uuid:download_token>/', views.download_info_view, name='download_info'),
    path('download/<uuid:download_token>/file/', views.download_file_view, name='download_file'),
]