# backend/accounts/admin.py
# Fixed version with correct format_html usage

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import User, UserSession


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin for User model
    """
    list_display = (
        'email', 'full_name', 'username', 'is_active', 'is_verified', 
        'storage_percentage_display', 'date_joined'
    )
    list_filter = (
        'is_active', 'is_staff', 'is_superuser', 'is_verified', 
        'date_joined', 'last_login'
    )
    search_fields = ('email', 'first_name', 'last_name', 'username')
    ordering = ('-date_joined',)
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('email', 'username', 'first_name', 'last_name')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 
                      'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Storage Information', {
            'fields': ('storage_used', 'max_storage'),
            'classes': ('collapse',)
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined', 'last_login_ip'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Personal Information', {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 
                      'password1', 'password2'),
        }),
        ('Permissions', {
            'classes': ('wide', 'collapse'),
            'fields': ('is_active', 'is_staff', 'is_superuser'),
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login', 'storage_percentage_display')
    
    def storage_percentage_display(self, obj):
        """Display storage usage as a progress bar"""
        percentage = obj.storage_percentage
        
        # Determine color based on percentage
        if percentage < 50:
            color = 'green'
        elif percentage < 80:
            color = 'orange'
        else:
            color = 'red'
        
        # Calculate width (max 100px)
        width = min(100, percentage)
        
        # Format percentage with 1 decimal place
        percentage_text = f"{percentage:.1f}%"
        
        # Build HTML string - using {} only for values, not for format specifiers
        html = (
            '<div style="width: 100px; background-color: #f0f0f0; border-radius: 3px;">'
            '<div style="width: {width}px; background-color: {color}; height: 20px; '
            'border-radius: 3px; text-align: center; color: white; line-height: 20px; '
            'font-size: 12px;">'
            '{percentage}'
            '</div></div>'
        ).format(width=width, color=color, percentage=percentage_text)
        
        return mark_safe(html)
    
    storage_percentage_display.short_description = 'Storage Usage'


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """
    Admin for UserSession model
    """
    list_display = (
        'user', 'ip_address', 'user_agent_short', 'created_at', 
        'last_activity', 'is_active'
    )
    list_filter = ('is_active', 'created_at', 'last_activity')
    search_fields = ('user__email', 'ip_address', 'user_agent')
    ordering = ('-last_activity',)
    readonly_fields = ('session_key', 'created_at')
    
    def user_agent_short(self, obj):
        """Display shortened user agent"""
        if len(obj.user_agent) > 50:
            return f"{obj.user_agent[:50]}..."
        return obj.user_agent
    
    user_agent_short.short_description = 'User Agent'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('user')


# Customize admin site headers
admin.site.site_header = 'SecureShare Administration'
admin.site.site_title = 'SecureShare Admin'
admin.site.index_title = 'Welcome to SecureShare Administration'