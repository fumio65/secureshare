# backend/files/views.py
# COMPLETE FILE WITH ZIP ARCHIVE SUPPORT (ONE LINK, ONE PASSWORD)

from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
from django.utils import timezone
from django.core.files.base import ContentFile
from collections import defaultdict
import os
import uuid
import zipfile  # 🆕 NEW IMPORT FOR ZIP
import io  # 🆕 NEW IMPORT FOR ZIP

from .models import FileUpload
from .serializers import (
    FileUploadSerializer, 
    FileUploadCreateSerializer, 
    FileDownloadSerializer,
    BulkFileUploadSerializer,
    FileShareLinkSerializer
)
from .utils import generate_secure_password, get_file_mime_type, get_pricing_tier


# ============================================================================
# SINGLE FILE OPERATIONS
# ============================================================================

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
        
        filename = serializer.validated_data['filename']
        file_size = serializer.validated_data['file_size']
        mime_type = serializer.validated_data.get('mime_type') or get_file_mime_type(filename)
        
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
    
    if upload.requires_payment and upload.status == 'pending':
        pass
    
    upload.status = 'completed'
    upload.save()
    
    return Response(
        FileUploadSerializer(upload).data,
        status=status.HTTP_200_OK
    )


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
    
    if uploaded_file.size != upload.file_size:
        return Response(
            {'error': 'File size mismatch'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
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


# ============================================================================
# BULK OPERATIONS - 🆕 ZIP ARCHIVE APPROACH (ONE LINK, ONE PASSWORD)
# ============================================================================

class BulkFileUploadCreateView(generics.CreateAPIView):
    """Create ZIP archive for multiple files - ONE link, ONE password."""
    
    serializer_class = BulkFileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]
    
    def create(self, request, *args, **kwargs):
        """Create single ZIP archive entry for multiple files."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        files_data = serializer.validated_data['files']
        
        # Calculate total size and pricing
        total_size = sum(f['file_size'] for f in files_data)
        pricing_tier, pricing_amount = get_pricing_tier(total_size)
        
        # Generate descriptive filename for ZIP
        file_count = len(files_data)
        if file_count == 1:
            # Single file - use original name
            zip_filename = files_data[0]['filename']
        else:
            # Multiple files - create descriptive ZIP name
            zip_filename = f"{file_count}_files_{uuid.uuid4().hex[:8]}.zip"
        
        # 🆕 Create SINGLE FileUpload entry for the ZIP archive
        upload = FileUpload.objects.create(
            user=request.user,
            original_filename=zip_filename,
            file_size=total_size,
            mime_type='application/zip' if file_count > 1 else files_data[0].get('mime_type', 'application/octet-stream'),
            download_password=generate_secure_password(),
            pricing_tier=pricing_tier,
            status='pending' if pricing_amount > 0 else 'processing',
            batch_id=uuid.uuid4(),
            upload_session_id=f"{request.user.id}_{int(timezone.now().timestamp())}",
            is_batch_upload=(file_count > 1),
            batch_position=0,
        )
        
        # Return SINGLE upload with file list metadata
        return Response({
            'upload': FileUploadSerializer(upload).data,
            'is_zip': file_count > 1,
            'contained_files': [f['filename'] for f in files_data],
            'total_files': file_count,
            'total_size': total_size,
            'pricing_tier': pricing_tier,
            'pricing_amount': pricing_amount,
            'requires_payment': pricing_amount > 0,
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_upload_content_view(request):
    """Upload multiple files and create ZIP archive automatically."""
    
    upload_id = request.data.get('upload_id')
    
    if not upload_id:
        return Response(
            {'error': 'No upload ID provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    upload = get_object_or_404(
        FileUpload,
        id=upload_id,
        user=request.user
    )
    
    # Get all uploaded files from request
    uploaded_files = []
    file_index = 0
    
    while True:
        file_key = f'file_{file_index}'
        if file_key not in request.FILES:
            break
        uploaded_files.append(request.FILES[file_key])
        file_index += 1
    
    if not uploaded_files:
        return Response(
            {'error': 'No files provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # 🆕 If multiple files, create ZIP archive
        if len(uploaded_files) > 1:
            # Create ZIP in memory
            zip_buffer = io.BytesIO()
            
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for idx, uploaded_file in enumerate(uploaded_files):
                    # Add each file to ZIP
                    zip_file.writestr(uploaded_file.name, uploaded_file.read())
            
            # Save ZIP file
            zip_buffer.seek(0)
            upload.encrypted_file.save(
                f"{upload.id}.zip",
                ContentFile(zip_buffer.read()),
                save=True
            )
        else:
            # Single file - save directly (no ZIP needed)
            file_ext = uploaded_files[0].name.split('.')[-1] if '.' in uploaded_files[0].name else 'bin'
            upload.encrypted_file.save(
                f"{upload.id}.{file_ext}",
                ContentFile(uploaded_files[0].read()),
                save=True
            )
        
        upload.status = 'completed'
        upload.save()
        
        return Response({
            'success': True,
            'upload': FileUploadSerializer(upload).data,
            'is_zip': len(uploaded_files) > 1,
            'files_in_archive': len(uploaded_files),
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to create archive: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ============================================================================
# TRANSFER MANAGEMENT - WITH BATCH GROUPING
# ============================================================================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def transfer_history_view(request):
    """Get user's transfer history with batch grouping."""
    
    uploads = FileUpload.objects.filter(user=request.user)
    
    # Calculate statistics
    total_uploads = uploads.count()
    total_downloads = sum(u.download_count for u in uploads)
    total_storage = sum(u.file_size for u in uploads)
    
    # Format total storage
    def format_size(size_bytes):
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.1f} TB"
    
    # Get recent uploads (last 10)
    recent_uploads = uploads[:10]
    
    # Group uploads by batch
    batches = defaultdict(list)
    
    for upload in uploads:
        batch_key = str(upload.batch_id)
        batches[batch_key].append(upload)
    
    # Convert batches to list format
    grouped_batches = []
    for batch_id, batch_files in batches.items():
        batch_files_sorted = sorted(batch_files, key=lambda x: x.batch_position)
        
        batch_total_size = sum(f.file_size for f in batch_files)
        batch_total_downloads = sum(f.download_count for f in batch_files)
        first_file = batch_files_sorted[0]
        
        grouped_batches.append({
            'batch_id': batch_id,
            'upload_session_id': first_file.upload_session_id,
            'is_batch_upload': first_file.is_batch_upload,
            'file_count': len(batch_files),
            'total_size': batch_total_size,
            'total_size_display': format_size(batch_total_size),
            'total_downloads': batch_total_downloads,
            'pricing_tier': first_file.pricing_tier,
            'created_at': first_file.created_at,
            'files': FileUploadSerializer(batch_files_sorted, many=True).data,
        })
    
    grouped_batches.sort(key=lambda x: x['created_at'], reverse=True)
    
    return Response({
        'statistics': {
            'total_uploads': total_uploads,
            'total_downloads': total_downloads,
            'total_storage_bytes': total_storage,
            'total_storage_display': format_size(total_storage) if total_storage > 0 else '0 B',
        },
        'recent_uploads': FileUploadSerializer(recent_uploads, many=True).data,
        'all_uploads': FileUploadSerializer(uploads, many=True).data,
        'grouped_batches': grouped_batches,
        'total_batches': len(grouped_batches),
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_share_link_view(request, upload_id):
    """Get share link for a completed upload."""
    
    upload = get_object_or_404(
        FileUpload,
        id=upload_id,
        user=request.user,
        status='completed'
    )
    
    serializer = FileShareLinkSerializer(
        upload,
        context={'request': request}
    )
    
    return Response(serializer.data)


# ============================================================================
# DOWNLOAD OPERATIONS (PUBLIC)
# ============================================================================

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def download_info_view(request, download_token):
    """Get download information without password."""
    
    upload = get_object_or_404(
        FileUpload, 
        download_token=download_token,
        status='completed'
    )
    
    if upload.is_expired:
        raise Http404("File has expired")
    
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
    
    if upload.is_expired:
        return Response(
            {'error': 'File has expired'},
            status=status.HTTP_410_GONE
        )
    
    serializer = FileDownloadSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    password = serializer.validated_data['password']
    
    if password != upload.download_password:
        return Response(
            {'error': 'Invalid password'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if not upload.encrypted_file or not os.path.exists(upload.encrypted_file.path):
        return Response(
            {'error': 'File not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    upload.download_count += 1
    upload.last_downloaded = timezone.now()
    upload.save()
    
    response = FileResponse(
        upload.encrypted_file.open('rb'),
        as_attachment=True,
        filename=upload.original_filename,
        content_type=upload.mime_type
    )
    
    return response