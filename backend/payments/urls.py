# backend/payments/urls.py
# URL patterns for payment endpoints

from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    # ========================================================================
    # CHECKOUT & PAYMENT CREATION
    # ========================================================================
    
    # Create Stripe Checkout Session
    path('create-checkout/', views.create_checkout_session, name='create_checkout'),
    
    # ========================================================================
    # WEBHOOK ENDPOINT
    # ========================================================================
    
    # Stripe webhook handler (public endpoint - no authentication)
    path('webhook/', views.stripe_webhook, name='stripe_webhook'),
    
    # ========================================================================
    # PAYMENT MANAGEMENT
    # ========================================================================
    
    # Get payment status
    path('<uuid:payment_id>/status/', views.payment_status, name='payment_status'),
    
    # Payment history
    path('history/', views.PaymentHistoryView.as_view(), name='payment_history'),
    
    # Payment statistics
    path('statistics/', views.payment_statistics, name='payment_statistics'),
]