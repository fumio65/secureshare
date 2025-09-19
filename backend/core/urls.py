# backend/core/urls.py
"""
SecureShare main URL configuration.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    """API root endpoint with basic information."""
    return JsonResponse({
        'message': 'Welcome to SecureShare API',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'files': '/api/files/',
            'payments': '/api/payments/',
        }
    })

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API root
    path('api/', api_root, name='api_root'),
    
    # Authentication endpoints
    path('api/auth/', include('accounts.urls')),
    
    # File management endpoints
    path('api/files/', include('files.urls')),
    
    # Payment endpoints
    path('api/payments/', include('payments.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)