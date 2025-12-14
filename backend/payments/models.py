# backend/payments/models.py
# Payment models for Stripe integration

from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class Payment(models.Model):
    """
    Payment transaction record for file uploads requiring payment.
    Tracks Stripe payment intents and checkout sessions.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('canceled', 'Canceled'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_TIER_CHOICES = [
        ('free', 'Free (≤100MB)'),
        ('premium', 'Premium (100MB-1GB)'),
        ('large', 'Large (1GB-5GB)'),
    ]
    
    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Relationships
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    
    file_upload = models.ForeignKey(
        'files.FileUpload',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )
    
    # Stripe Information
    stripe_payment_intent_id = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        help_text="Stripe Payment Intent ID"
    )
    
    stripe_checkout_session_id = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        help_text="Stripe Checkout Session ID"
    )
    
    # Payment Details
    amount = models.IntegerField(
        help_text="Amount in cents (e.g., 300 = $3.00)"
    )
    
    currency = models.CharField(
        max_length=3,
        default='usd',
        help_text="Currency code (ISO 4217)"
    )
    
    payment_tier = models.CharField(
        max_length=20,
        choices=PAYMENT_TIER_CHOICES,
        default='premium'
    )
    
    # Status Tracking
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Metadata
    description = models.TextField(
        blank=True,
        help_text="Payment description"
    )
    
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional payment metadata"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['stripe_payment_intent_id']),
            models.Index(fields=['stripe_checkout_session_id']),
        ]
    
    def __str__(self):
        return f"Payment {self.id} - {self.user.email} - ${self.amount_dollars} - {self.status}"
    
    @property
    def amount_dollars(self):
        """Convert cents to dollars for display."""
        return f"{self.amount / 100:.2f}"
    
    @property
    def is_successful(self):
        """Check if payment was successful."""
        return self.status == 'succeeded'
    
    @property
    def is_pending(self):
        """Check if payment is pending."""
        return self.status in ['pending', 'processing']
    
    def mark_as_succeeded(self):
        """Mark payment as succeeded."""
        self.status = 'succeeded'
        self.paid_at = timezone.now()
        self.save()
    
    def mark_as_failed(self):
        """Mark payment as failed."""
        self.status = 'failed'
        self.save()
    
    def mark_as_refunded(self):
        """Mark payment as refunded."""
        self.status = 'refunded'
        self.refunded_at = timezone.now()
        self.save()


class StripeWebhookEvent(models.Model):
    """
    Log of Stripe webhook events for debugging and audit trail.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Event Information
    stripe_event_id = models.CharField(
        max_length=255,
        unique=True,
        help_text="Stripe Event ID"
    )
    
    event_type = models.CharField(
        max_length=100,
        help_text="Stripe event type (e.g., payment_intent.succeeded)"
    )
    
    # Related Payment (if applicable)
    payment = models.ForeignKey(
        Payment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='webhook_events'
    )
    
    # Event Data
    event_data = models.JSONField(
        help_text="Complete webhook event data"
    )
    
    # Processing Status
    processed = models.BooleanField(
        default=False,
        help_text="Whether this event has been processed"
    )
    
    processed_at = models.DateTimeField(null=True, blank=True)
    
    error_message = models.TextField(
        blank=True,
        help_text="Error message if processing failed"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['stripe_event_id']),
            models.Index(fields=['event_type', '-created_at']),
            models.Index(fields=['processed', '-created_at']),
        ]
    
    def __str__(self):
        return f"Webhook {self.event_type} - {self.stripe_event_id}"
    
    def mark_as_processed(self):
        """Mark webhook event as processed."""
        self.processed = True
        self.processed_at = timezone.now()
        self.save()
    
    def mark_as_failed(self, error_message):
        """Mark webhook event as failed with error message."""
        self.error_message = error_message
        self.save()