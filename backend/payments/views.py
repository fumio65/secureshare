# backend/payments/views.py
# Stripe payment processing views

from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
import stripe
import logging

from .models import Payment, StripeWebhookEvent
from .serializers import PaymentSerializer, CreateCheckoutSessionSerializer
from files.models import FileUpload

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_checkout_session(request):
    """Create a Stripe Checkout Session for file upload payment."""
    serializer = CreateCheckoutSessionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    upload_id = serializer.validated_data.get('upload_id')
    amount = serializer.validated_data['amount']
    payment_tier = serializer.validated_data.get('payment_tier', 'premium')
    success_url = serializer.validated_data.get('success_url', f"{settings.FRONTEND_URL}/dashboard?payment=success")
    cancel_url = serializer.validated_data.get('cancel_url', f"{settings.FRONTEND_URL}/dashboard?payment=canceled")
    
    file_upload = None
    if upload_id:
        file_upload = get_object_or_404(FileUpload, id=upload_id, user=request.user)
    
    try:
        payment = Payment.objects.create(
            user=request.user,
            file_upload=file_upload,
            amount=amount,
            currency='usd',
            payment_tier=payment_tier,
            status='pending',
            description=f"File upload payment - {payment_tier}",
            metadata={
                'user_id': str(request.user.id),
                'user_email': request.user.email,
                'upload_id': str(upload_id) if upload_id else None,
                'payment_tier': payment_tier,
            }
        )
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': amount,
                    'product_data': {
                        'name': f'SecureShare - {payment_tier.capitalize()} Upload',
                        'description': f'Secure file upload ({payment_tier})',
                    },
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url + f'&session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=cancel_url,
            client_reference_id=str(payment.id),
            customer_email=request.user.email,
            metadata={
                'payment_id': str(payment.id),
                'user_id': str(request.user.id),
                'upload_id': str(upload_id) if upload_id else '',
            }
        )
        
        payment.stripe_checkout_session_id = checkout_session.id
        payment.save()
        
        logger.info(f"Created checkout session: {checkout_session.id}")
        
        return Response({
            'checkout_session_id': checkout_session.id,
            'checkout_url': checkout_session.url,
            'payment_id': str(payment.id),
            'amount': amount,
            'currency': 'usd',
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    """Handle Stripe webhook events."""
    return HttpResponse(status=200)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_status(request, payment_id):
    """Get payment status."""
    payment = get_object_or_404(Payment, id=payment_id, user=request.user)
    serializer = PaymentSerializer(payment)
    return Response(serializer.data)


class PaymentHistoryView(generics.ListAPIView):
    """List user's payment history."""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_statistics(request):
    """Get user's payment statistics."""
    payments = Payment.objects.filter(user=request.user)
    total_payments = payments.count()
    successful_payments = payments.filter(status='succeeded').count()
    total_spent = sum(p.amount for p in payments.filter(status='succeeded'))
    
    return Response({
        'total_payments': total_payments,
        'successful_payments': successful_payments,
        'total_spent': total_spent,
        'total_spent_display': f"${total_spent / 100:.2f}",
    })