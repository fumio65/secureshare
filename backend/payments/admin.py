# backend/payments/admin.py
# Django admin configuration for payments

from django.contrib import admin
from django.utils.html import format_html
from .models import Payment, StripeWebhookEvent


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin interface for Payment model."""
    
    list_display = [
        'id',
        'user_email',
        'colored_status',
        'amount_display',
        'payment_tier',
        'file_upload_link',
        'created_at',
    ]
    
    list_filter = [
        'status',
        'payment_tier',
        'currency',
        'created_at',
    ]
    
    search_fields = [
        'id',
        'user__email',
        'stripe_payment_intent_id',
        'stripe_checkout_session_id',
    ]
    
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'paid_at',
        'refunded_at',
        'amount_display',
        'stripe_links',
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'file_upload', 'status')
        }),
        ('Payment Details', {
            'fields': ('amount', 'amount_display', 'currency', 'payment_tier', 'description')
        }),
        ('Stripe Information', {
            'fields': ('stripe_payment_intent_id', 'stripe_checkout_session_id', 'stripe_links')
        }),
        ('Metadata', {
            'fields': ('metadata',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at', 'refunded_at')
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def colored_status(self, obj):
        colors = {
            'pending': 'orange',
            'processing': 'blue',
            'succeeded': 'green',
            'failed': 'red',
            'canceled': 'gray',
            'refunded': 'purple',
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.status.upper()
        )
    colored_status.short_description = 'Status'
    colored_status.admin_order_field = 'status'
    
    def amount_display(self, obj):
        return f"${obj.amount_dollars}"
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'
    
    def file_upload_link(self, obj):
        if obj.file_upload:
            return format_html(
                '<a href="/admin/files/fileupload/{}/change/">{}</a>',
                obj.file_upload.id,
                obj.file_upload.original_filename
            )
        return '-'
    file_upload_link.short_description = 'File Upload'
    
    def stripe_links(self, obj):
        links = []
        if obj.stripe_payment_intent_id:
            links.append(format_html(
                '<a href="https://dashboard.stripe.com/test/payments/{}" target="_blank">View Payment Intent</a>',
                obj.stripe_payment_intent_id
            ))
        if obj.stripe_checkout_session_id:
            links.append(format_html(
                '<a href="https://dashboard.stripe.com/test/checkout/sessions/{}" target="_blank">View Checkout Session</a>',
                obj.stripe_checkout_session_id
            ))
        return format_html('<br>'.join(links)) if links else '-'
    stripe_links.short_description = 'Stripe Dashboard Links'


@admin.register(StripeWebhookEvent)
class StripeWebhookEventAdmin(admin.ModelAdmin):
    """Admin interface for Stripe webhook events."""
    
    list_display = [
        'stripe_event_id',
        'event_type',
        'colored_processed',
        'payment_link',
        'created_at',
    ]
    
    list_filter = [
        'event_type',
        'processed',
        'created_at',
    ]
    
    search_fields = [
        'stripe_event_id',
        'event_type',
        'payment__id',
    ]
    
    readonly_fields = [
        'id',
        'stripe_event_id',
        'event_type',
        'payment',
        'event_data',
        'processed',
        'processed_at',
        'created_at',
    ]
    
    fieldsets = (
        ('Event Information', {
            'fields': ('id', 'stripe_event_id', 'event_type', 'payment')
        }),
        ('Processing Status', {
            'fields': ('processed', 'processed_at', 'error_message')
        }),
        ('Event Data', {
            'fields': ('event_data',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )
    
    def colored_processed(self, obj):
        if obj.processed:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ PROCESSED</span>'
            )
        elif obj.error_message:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ FAILED</span>'
            )
        else:
            return format_html(
                '<span style="color: orange; font-weight: bold;">⧗ PENDING</span>'
            )
    colored_processed.short_description = 'Status'
    colored_processed.admin_order_field = 'processed'
    
    def payment_link(self, obj):
        if obj.payment:
            return format_html(
                '<a href="/admin/payments/payment/{}/change/">{}</a>',
                obj.payment.id,
                str(obj.payment.id)[:8]
            )
        return '-'
    payment_link.short_description = 'Payment'