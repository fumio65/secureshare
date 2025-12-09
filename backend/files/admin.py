# backend/files/admin.py

from django.contrib import admin
from django.utils.html import format_html
from .models import FileUpload


@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    """Admin interface for file uploads."""
    
    list_display = [
        'original_filename',
        'user_email',
        'file_size_badge',
        'pricing_tier_badge',
        'status_badge',
        'download_count',
        'created_at',
        'expires_at'
    ]
    
    list_filter = [
        'status',
        'pricing_tier',
        'requires_payment',
        'created_at',
        'expires_at'
    ]
    
    search_fields = [
        'original_filename',
        'user__email',
        'download_token'
    ]
    
    readonly_fields = [
        'id',
        'download_token',
        'download_password',
        'file_size_display',
        'download_url',
        'created_at',
        'updated_at',
        'last_downloaded'
    ]
    
    fieldsets = (
        ('File Information', {
            'fields': ('id', 'user', 'original_filename', 'file_size', 'file_size_display', 'mime_type')
        }),
        ('Security', {
            'fields': ('download_token', 'download_password', 'download_url')
        }),
        ('Status & Pricing', {
            'fields': ('status', 'pricing_tier', 'requires_payment')
        }),
        ('Storage', {
            'fields': ('encrypted_file',)
        }),
        ('Expiration', {
            'fields': ('expires_at',)
        }),
        ('Statistics', {
            'fields': ('download_count', 'last_downloaded')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def user_email(self, obj):
        """Display user email."""
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def file_size_badge(self, obj):
        """Display file size as badge."""
        return format_html(
            '<span style="background-color: #e3f2fd; color: #1976d2; padding: 3px 8px; border-radius: 4px; font-weight: 500;">{}</span>',
            obj.file_size_display
        )
    file_size_badge.short_description = 'Size'
    
    def pricing_tier_badge(self, obj):
        """Display pricing tier as colored badge."""
        colors = {
            'free': ('#e8f5e9', '#2e7d32'),
            'premium': ('#e3f2fd', '#1976d2'),
            'large': ('#f3e5f5', '#7b1fa2')
        }
        bg_color, text_color = colors.get(obj.pricing_tier, ('#f5f5f5', '#616161'))
        
        return format_html(
            '<span style="background-color: {}; color: {}; padding: 3px 8px; border-radius: 4px; font-weight: 500;">{}</span>',
            bg_color,
            text_color,
            obj.get_pricing_tier_display()
        )
    pricing_tier_badge.short_description = 'Tier'
    pricing_tier_badge.admin_order_field = 'pricing_tier'
    
    def status_badge(self, obj):
        """Display status as colored badge."""
        colors = {
            'pending': ('#fff3e0', '#e65100'),
            'processing': ('#e3f2fd', '#1976d2'),
            'completed': ('#e8f5e9', '#2e7d32'),
            'failed': ('#ffebee', '#c62828'),
            'expired': ('#f5f5f5', '#616161')
        }
        bg_color, text_color = colors.get(obj.status, ('#f5f5f5', '#616161'))
        
        return format_html(
            '<span style="background-color: {}; color: {}; padding: 3px 8px; border-radius: 4px; font-weight: 500;">{}</span>',
            bg_color,
            text_color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        qs = super().get_queryset(request)
        return qs.select_related('user')

