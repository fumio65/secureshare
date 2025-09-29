from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import User, UserSession
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer, 
    UserProfileSerializer,
    ChangePasswordSerializer
)
import uuid

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer to include user data
    """
    username_field = 'email'

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user data to token response
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'full_name': self.user.full_name,
            'is_verified': self.user.is_verified,
            'storage_used': self.user.storage_used,
            'max_storage': self.user.max_storage,
            'storage_percentage': self.user.storage_percentage,
        }
        
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view with session tracking
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Get user from email
            email = request.data.get('email', '').lower()
            user = User.objects.filter(email=email).first()
            
            if user:
                # Update last login info
                user.last_login = timezone.now()
                user.last_login_ip = self.get_client_ip(request)
                user.save(update_fields=['last_login', 'last_login_ip'])
                
                # Create session tracking
                self.create_user_session(user, request)
        
        return response
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def create_user_session(self, user, request):
        """Create user session record"""
        session_key = str(uuid.uuid4())
        UserSession.objects.create(
            user=user,
            session_key=session_key,
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
        )


class UserRegistrationView(APIView):
    """
    User registration endpoint
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens for immediate login after registration
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'full_name': user.full_name,
                    'is_verified': user.is_verified,
                    'storage_used': user.storage_used,
                    'max_storage': user.max_storage,
                    'storage_percentage': user.storage_percentage,
                },
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Registration failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update user profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    Change user password
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'success': True,
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Password change failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Logout user and blacklist refresh token
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Mark user sessions as inactive
            UserSession.objects.filter(
                user=request.user,
                is_active=True
            ).update(is_active=False)
            
            return Response({
                'success': True,
                'message': 'Logged out successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Logout failed',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_sessions(request):
    """
    Get user's active sessions
    """
    sessions = UserSession.objects.filter(
        user=request.user,
        is_active=True
    ).order_by('-last_activity')[:10]
    
    sessions_data = []
    for session in sessions:
        sessions_data.append({
            'id': session.id,
            'ip_address': session.ip_address,
            'user_agent': session.user_agent[:100] + '...' if len(session.user_agent) > 100 else session.user_agent,
            'created_at': session.created_at,
            'last_activity': session.last_activity,
        })
    
    return Response({
        'success': True,
        'sessions': sessions_data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def auth_status(request):
    """
    Check authentication status and return user info
    """
    user = request.user
    
    return Response({
        'success': True,
        'authenticated': True,
        'user': {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': user.full_name,
            'is_verified': user.is_verified,
            'storage_used': user.storage_used,
            'max_storage': user.max_storage,
            'storage_percentage': user.storage_percentage,
            'date_joined': user.date_joined,
            'last_login': user.last_login,
        }
    }, status=status.HTTP_200_OK)