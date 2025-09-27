from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent API responses
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Log the exception
        logger.error(f"API Exception: {exc}", exc_info=True)
        
        # Create custom response format
        custom_response_data = {
            'success': False,
            'message': 'An error occurred',
            'errors': {}
        }

        # Handle different types of errors
        if hasattr(response, 'data'):
            if isinstance(response.data, dict):
                # Handle field errors
                if 'detail' in response.data:
                    custom_response_data['message'] = response.data['detail']
                else:
                    custom_response_data['errors'] = response.data
                    
                    # Set appropriate message based on status code
                    if response.status_code == status.HTTP_400_BAD_REQUEST:
                        custom_response_data['message'] = 'Validation error'
                    elif response.status_code == status.HTTP_401_UNAUTHORIZED:
                        custom_response_data['message'] = 'Authentication failed'
                    elif response.status_code == status.HTTP_403_FORBIDDEN:
                        custom_response_data['message'] = 'Permission denied'
                    elif response.status_code == status.HTTP_404_NOT_FOUND:
                        custom_response_data['message'] = 'Resource not found'
                    elif response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
                        custom_response_data['message'] = 'Method not allowed'
                    elif response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
                        custom_response_data['message'] = 'Too many requests'
                    else:
                        custom_response_data['message'] = 'Request failed'
                        
            elif isinstance(response.data, list):
                custom_response_data['message'] = response.data[0] if response.data else 'An error occurred'
            else:
                custom_response_data['message'] = str(response.data)

        response.data = custom_response_data

    return response


class SecureShareException(Exception):
    """Base exception class for SecureShare"""
    default_message = "An error occurred"
    default_code = "error"
    
    def __init__(self, message=None, code=None):
        self.message = message or self.default_message
        self.code = code or self.default_code
        super().__init__(self.message)


class ValidationError(SecureShareException):
    """Validation error exception"""
    default_message = "Validation error"
    default_code = "validation_error"


class AuthenticationError(SecureShareException):
    """Authentication error exception"""
    default_message = "Authentication failed"
    default_code = "authentication_error"


class PermissionError(SecureShareException):
    """Permission error exception"""
    default_message = "Permission denied"
    default_code = "permission_error"


class FileError(SecureShareException):
    """File operation error exception"""
    default_message = "File operation failed"
    default_code = "file_error"


class PaymentError(SecureShareException):
    """Payment error exception"""
    default_message = "Payment processing failed"
    default_code = "payment_error"