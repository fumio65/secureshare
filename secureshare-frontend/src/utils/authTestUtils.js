export const createTestUser = () => ({
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123',
  first_name: 'Test',
  last_name: 'User'
});

export const testCredentials = {
  valid: {
    email: 'test@secureshare.com',
    password: 'SecurePass123'
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  }
};

export const validateAuthFlow = async (authService) => {
  const tests = [];
  
  try {
    // Test 1: Token validation
    const hasToken = authService.isAuthenticated();
    tests.push({
      name: 'Token Validation',
      passed: typeof hasToken === 'boolean',
      message: hasToken ? 'User is authenticated' : 'User is not authenticated'
    });

    // Test 2: Token expiration check
    if (hasToken) {
      const expirationTime = authService.getTokenExpirationTime();
      const isValid = expirationTime && expirationTime > Date.now();
      tests.push({
        name: 'Token Expiration',
        passed: isValid,
        message: isValid ? 'Token is valid' : 'Token is expired or invalid'
      });
    }

    // Test 3: Profile fetch (if authenticated)
    if (hasToken) {
      try {
        const profile = await authService.getProfile();
        tests.push({
          name: 'Profile Fetch',
          passed: profile && profile.email,
          message: profile ? `Profile loaded for ${profile.email}` : 'Profile fetch failed'
        });
      } catch (error) {
        tests.push({
          name: 'Profile Fetch',
          passed: false,
          message: `Profile fetch error: ${error.message}`
        });
      }
    }

  } catch (error) {
    tests.push({
      name: 'Auth Flow Test',
      passed: false,
      message: `Test error: ${error.message}`
    });
  }

  return tests;
};

export const logAuthStatus = (user, isAuthenticated, isLoading) => {
  console.group('🔐 Auth Status');
  console.log('Is Loading:', isLoading);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('User:', user);
  console.log('Access Token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
  console.log('Refresh Token:', localStorage.getItem('refresh_token') ? 'Present' : 'Missing');
  console.groupEnd();
};