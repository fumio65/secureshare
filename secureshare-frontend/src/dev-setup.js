// Development setup utilities
import authService from './services/authService';
import { testCredentials, validateAuthFlow, logAuthStatus } from './utils/authTestUtils';

// Add development utilities to window for browser console access
if (import.meta.env.DEV) {
  window.devTools = {
    auth: authService,
    testCredentials,
    validateAuthFlow,
    logAuthStatus,
    
    // Quick test functions
    async testLogin() {
      try {
        const result = await authService.login(testCredentials.valid);
        console.log('✅ Login test successful:', result);
        return result;
      } catch (error) {
        console.error('❌ Login test failed:', error.message);
        throw error;
      }
    },

    async testRegistration() {
      const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123',
        first_name: 'Test',
        last_name: 'User'
      };
      
      try {
        const result = await authService.register(testUser);
        console.log('✅ Registration test successful:', result);
        return result;
      } catch (error) {
        console.error('❌ Registration test failed:', error.message);
        throw error;
      }
    },

    async testTokenRefresh() {
      try {
        const result = await authService.refreshTokenIfNeeded();
        console.log('✅ Token refresh successful:', result);
        return result;
      } catch (error) {
        console.error('❌ Token refresh failed:', error.message);
        throw error;
      }
    },

    clearTokens() {
      authService.clearTokens();
      console.log('🧹 Tokens cleared');
    },

    async runAuthTests() {
      const results = await validateAuthFlow(authService);
      console.group('🧪 Auth Tests Results');
      results.forEach(test => {
        const emoji = test.passed ? '✅' : '❌';
        console.log(`${emoji} ${test.name}: ${test.message}`);
      });
      console.groupEnd();
      return results;
    }
  };

  console.log('🛠️  Dev tools available on window.devTools');
  console.log('Available methods:', Object.keys(window.devTools));
}