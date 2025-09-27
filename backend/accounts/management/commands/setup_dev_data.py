from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()


class Command(BaseCommand):
    help = 'Set up development data for SecureShare'

    def add_arguments(self, parser):
        parser.add_argument(
            '--admin-email',
            type=str,
            default='admin@secureshare.dev',
            help='Admin user email'
        )
        parser.add_argument(
            '--admin-password',
            type=str,
            default='admin123',
            help='Admin user password'
        )

    def handle(self, *args, **options):
        with transaction.atomic():
            self.stdout.write('Setting up SecureShare development data...')
            
            # Create admin user
            admin_email = options['admin_email']
            admin_password = options['admin_password']
            
            if not User.objects.filter(email=admin_email).exists():
                admin_user = User.objects.create_superuser(
                    email=admin_email,
                    username='admin',
                    first_name='Admin',
                    last_name='User',
                    password=admin_password
                )
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Created admin user: {admin_email} (password: {admin_password})'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Admin user {admin_email} already exists')
                )

            # Create test users
            test_users = [
                {
                    'email': 'test@secureshare.dev',
                    'username': 'testuser',
                    'first_name': 'Test',
                    'last_name': 'User',
                    'password': 'testpass123'
                },
                {
                    'email': 'demo@secureshare.dev',
                    'username': 'demouser',
                    'first_name': 'Demo',
                    'last_name': 'User',
                    'password': 'demopass123'
                }
            ]

            for user_data in test_users:
                if not User.objects.filter(email=user_data['email']).exists():
                    user = User.objects.create_user(**user_data)
                    user.is_verified = True
                    user.save()
                    
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Created test user: {user_data["email"]} (password: {user_data["password"]})'
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f'Test user {user_data["email"]} already exists')
                    )

            self.stdout.write(
                self.style.SUCCESS('Development data setup completed!')
            )
            
            # Print API endpoints
            self.stdout.write('\nAPI Endpoints:')
            self.stdout.write('Authentication:')
            self.stdout.write('  POST /api/auth/register/ - User registration')
            self.stdout.write('  POST /api/auth/login/ - User login')
            self.stdout.write('  POST /api/auth/logout/ - User logout')
            self.stdout.write('  POST /api/auth/token/refresh/ - Refresh JWT token')
            self.stdout.write('  GET  /api/auth/profile/ - Get user profile')
            self.stdout.write('  PUT  /api/auth/profile/ - Update user profile')
            self.stdout.write('  POST /api/auth/change-password/ - Change password')
            self.stdout.write('  GET  /api/auth/auth-status/ - Check authentication status')
            self.stdout.write('  GET  /api/auth/sessions/ - Get user sessions')
            
            self.stdout.write('\nTest the API:')
            self.stdout.write('curl -X POST http://localhost:8000/api/auth/login/ \\')
            self.stdout.write('  -H "Content-Type: application/json" \\')
            self.stdout.write('  -d \'{"email": "test@secureshare.dev", "password": "testpass123"}\'')
            self.stdout.write('')