from django.urls import path
from django.http import JsonResponse

def files_placeholder(request):
    return JsonResponse({
        'message': 'Files API endpoints will be implemented in Phase 4',
        'planned_endpoints': [
            'POST /api/files/upload/ - Upload encrypted files',
            'GET /api/files/ - List user files',
            'GET /api/files/{id}/ - Get file details',
            'POST /api/files/{id}/download/ - Password-protected download',
            'DELETE /api/files/{id}/ - Delete file'
        ]
    })

app_name = 'files'

urlpatterns = [
    path('', files_placeholder, name='files_root'),
]