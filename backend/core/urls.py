from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from django.http import JsonResponse

def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        'message': 'SecureShare API',
        'version': '1.0',
        'endpoints': {
            'authentication': '/api/auth/',
            'files': '/api/files/',
            'payments': '/api/payments/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API root
    path('api/', api_root, name='api_root'),
    
    # Authentication endpoints
    path('api/auth/', include('accounts.urls')),
    
    # Files endpoints (to be implemented)
    path('api/files/', include('files.urls')),
    
    # Payments endpoints (to be implemented)
    path('api/payments/', include('payments.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)