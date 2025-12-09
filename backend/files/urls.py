# backend/files/urls.py
# COMPLETE FILE WITH ALL URL PATTERNS

from django.urls import path
from . import views

app_name = 'files'

urlpatterns = [
    # ========================================================================
    # SINGLE FILE OPERATIONS
    # ========================================================================
    
    # List all user's uploads
    path('', views.FileUploadListView.as_view(), name='upload_list'),
    
    # Create new upload entry
    path('create/', views.FileUploadCreateView.as_view(), name='upload_create'),
    
    # Upload detail (get/update/delete)
    path('<uuid:pk>/', views.FileUploadDetailView.as_view(), name='upload_detail'),
    
    # Complete upload (after payment if needed)
    path('<uuid:upload_id>/complete/', views.complete_upload_view, name='complete_upload'),
    
    # Upload file content
    path('<uuid:upload_id>/upload/', views.upload_file_content_view, name='upload_content'),
    
    # Get share link for completed upload
    path('<uuid:upload_id>/share-link/', views.get_share_link_view, name='share_link'),
    
    # ========================================================================
    # BULK OPERATIONS (NEW)
    # ========================================================================
    
    # Create multiple upload entries
    path('bulk/create/', views.BulkFileUploadCreateView.as_view(), name='bulk_create'),
    
    # Upload multiple file contents
    path('bulk/upload/', views.bulk_upload_content_view, name='bulk_upload'),
    
    # ========================================================================
    # TRANSFER MANAGEMENT (NEW)
    # ========================================================================
    
    # Get transfer history with statistics
    path('history/', views.transfer_history_view, name='transfer_history'),
    
    # ========================================================================
    # DOWNLOAD ENDPOINTS (PUBLIC - No Authentication Required)
    # ========================================================================
    
    # Get file info for download page
    path('download/<uuid:download_token>/', views.download_info_view, name='download_info'),
    
    # Download file with password
    path('download/<uuid:download_token>/file/', views.download_file_view, name='download_file'),
]