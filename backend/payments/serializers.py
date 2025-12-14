# backend/payments/serializers.py
# Serializers for payment models and requests

from rest_framework import serializers
from .models import Payment, StripeWebhookEvent


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    
    amount_dollars = serializers.ReadOnlyField()
    is_successful = serializers.ReadOnlyField()
    is_pending = serializers.ReadOnlyField()
    user_email = serializers.EmailField(source='user.email', read_only=True)
    file_name = serializers.CharField(source='file_upload.original_filename', read_only=True, allow_null=True)
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'user_email',
            'file_upload',
            'file_name',
            'stripe_payment_intent_id',
            'stripe_checkout_session_id',
            'amount',
            'amount_dollars',
            'currency',
            'payment_tier',
            'status',
            'is_successful',
            'is_pending',
            'description',
            'metadata',
            'created_at',
            'updated_at',
            'paid_at',
            'refunded_at',
        ]
        read_only_fields = [
            'id',
            'user_email',
            'stripe_payment_intent_id',
            'stripe_checkout_session_id',
            'amount_dollars',
            'is_successful',
            'is_pending',
            'created_at',
            'updated_at',
            'paid_at',
            'refunded_at',
        ]


class CreateCheckoutSessionSerializer(serializers.Serializer):
    """Serializer for creating a Stripe Checkout Session."""
    
    upload_id = serializers.UUIDField(required=False, allow_null=True)
    amount = serializers.IntegerField(min_value=1, help_text="Amount in cents")
    payment_tier = serializers.ChoiceField(
        choices=['premium', 'large'],
        default='premium'
    )
    success_url = serializers.URLField(required=False)
    cancel_url = serializers.URLField(required=False)
    
    def validate_amount(self, value):
        """Validate amount matches expected pricing."""
        if value not in [300, 800]:  # $3.00 or $8.00
            raise serializers.ValidationError(
                "Amount must be either 300 ($3.00) or 800 ($8.00)"
            )
        return value


class StripeWebhookEventSerializer(serializers.ModelSerializer):
    """Serializer for Stripe webhook events."""
    
    class Meta:
        model = StripeWebhookEvent
        fields = [
            'id',
            'stripe_event_id',
            'event_type',
            'payment',
            'event_data',
            'processed',
            'processed_at',
            'error_message',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']