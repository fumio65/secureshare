#!/usr/bin/env node

// Integration test script for authentication flow
// Run with: node test-auth-integration.js

const API_BASE_URL = 'http://localhost:8000/api';

async function testAuthAPI() {
  console.log('🧪 Testing Authentication API Integration\n');

  let storedTokens = {};

  const tests = [
    {
      name: 'Health Check',
      test: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/auth-status/`);
          return { 
            success: response.ok, 
            message: `API Status: ${response.status}`,
            details: response.ok ? 'API is accessible' : 'API connection failed'
          };
        } catch (error) {
          return { 
            success: false, 
            message: `Connection error: ${error.message}`,
            details: 'Make sure Django backend is running on port 8000'
          };
        }
      }
    },
    {
      name: 'Registration Test',
      test: async () => {
        try {
          const testUser = {
            email: `test-${Date.now()}@example.com`,
            password: 'TestPassword123',
            first_name: 'Test',
            last_name: 'User'
          };

          const response = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
          });

          const data = await response.json();
          
          if (response.ok && data.access && data.refresh) {
            storedTokens.access = data.access;
            storedTokens.refresh = data.refresh;
            return { 
              success: true, 
              message: 'Registration successful with tokens',
              details: `User created: ${testUser.email}`,
              data: { user: data.user, hasTokens: true }
            };
          } else if (response.ok) {
            return { 
              success: true, 
              message: 'Registration successful (no auto-login)',
              details: `User created: ${testUser.email}`,
              data: data
            };
          } else {
            return { 
              success: false, 
              message: data.detail || 'Registration failed',
              details: JSON.stringify(data, null, 2),
              data 
            };
          }
        } catch (error) {
          return { 
            success: false, 
            message: `Registration error: ${error.message}`,
            details: error.stack
          };
        }
      }
    },
    {
      name: 'Login Test',
      test: async () => {
        try {
          const credentials = {
            email: 'admin@secureshare.com',
            password: 'admin123'
          };

          const response = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });

          const data = await response.json();
          
          if (response.ok && data.access && data.refresh) {
            storedTokens.access = data.access;
            storedTokens.refresh = data.refresh;
            return { 
              success: true, 
              message: 'Login successful with tokens',
              details: `Logged in as: ${credentials.email}`,
              data: { user: data.user, hasTokens: true }
            };
          } else {
            return { 
              success: false, 
              message: data.detail || 'Login failed',
              details: `Status: ${response.status}, Response: ${JSON.stringify(data)}`,
              data 
            };
          }
        } catch (error) {
          return { 
            success: false, 
            message: `Login error: ${error.message}`,
            details: error.stack
          };
        }
      }
    },
    {
      name: 'Profile Fetch Test',
      test: async () => {
        try {
          if (!storedTokens.access) {
            return { 
              success: false, 
              message: 'No access token available',
              details: 'Login test must succeed first'
            };
          }

          const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedTokens.access}`
            }
          });

          const data = await response.json();
          
          if (response.ok && data.email) {
            return { 
              success: true, 
              message: 'Profile fetch successful',
              details: `Profile loaded for: ${data.email}`,
              data: data
            };
          } else {
            return { 
              success: false, 
              message: data.detail || 'Profile fetch failed',
              details: `Status: ${response.status}`,
              data 
            };
          }
        } catch (error) {
          return { 
            success: false, 
            message: `Profile fetch error: ${error.message}`,
            details: error.stack
          };
        }
      }
    },
    {
      name: 'Token Refresh Test',
      test: async () => {
        try {
          if (!storedTokens.refresh) {
            return { 
              success: false, 
              message: 'No refresh token available',
              details: 'Login test must succeed first'
            };
          }

          const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: storedTokens.refresh })
          });

          const data = await response.json();
          
          if (response.ok && data.access) {
            storedTokens.access = data.access;
            if (data.refresh) {
              storedTokens.refresh = data.refresh;
            }
            return { 
              success: true, 
              message: 'Token refresh successful',
              details: 'New access token obtained',
              data: { hasNewToken: true }
            };
          } else {
            return { 
              success: false, 
              message: data.detail || 'Token refresh failed',
              details: `Status: ${response.status}`,
              data 
            };
          }
        } catch (error) {
          return { 
            success: false, 
            message: `Token refresh error: ${error.message}`,
            details: error.stack
          };
        }
      }
    },
    {
      name: 'Logout Test',
      test: async () => {
        try {
          if (!storedTokens.access || !storedTokens.refresh) {
            return { 
              success: false, 
              message: 'No tokens available for logout',
              details: 'Login test must succeed first'
            };
          }

          const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedTokens.access}`
            },
            body: JSON.stringify({ refresh: storedTokens.refresh })
          });

          if (response.ok) {
            storedTokens = {}; // Clear tokens
            return { 
              success: true, 
              message: 'Logout successful',
              details: 'Tokens invalidated on server',
            };
          } else {
            const data = await response.json();
            return { 
              success: false, 
              message: data.detail || 'Logout failed',
              details: `Status: ${response.status}`,
              data 
            };
          }
        } catch (error) {
          return { 
            success: false, 
            message: `Logout error: ${error.message}`,
            details: error.stack
          };
        }
      }
    }
  ];

  const results = [];
  let passCount = 0;

  for (const { name, test } of tests) {
    console.log(`\n🔄 Running: ${name}`);
    
    try {
      const result = await test();
      const emoji = result.success ? '✅' : '❌';
      
      console.log(`${emoji} ${name}: ${result.message}`);
      
      if (result.details) {
        console.log(`   ${result.details}`);
      }
      
      if (result.data && process.env.DEBUG) {
        console.log('   Data:', JSON.stringify(result.data, null, 2));
      }
      
      results.push({ name, ...result });
      if (result.success) passCount++;
      
    } catch (error) {
      const result = { success: false, message: `Unexpected error: ${error.message}` };
      console.log(`❌ ${name}: ${result.message}`);
      results.push({ name, ...result });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`🏁 Test Summary: ${passCount}/${tests.length} tests passed`);
  console.log('='.repeat(50));
  
  const failedTests = results.filter(r => !r.success);
  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`   • ${test.name}: ${test.message}`);
    });
  }

  console.log('\n💡 Usage:');
  console.log('   DEBUG=1 node test-auth-integration.js  # Show detailed output');
  console.log('   Ensure Django backend is running on http://localhost:8000');
  
  return results;
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
  testAuthAPI().catch(error => {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  });
}

export default testAuthAPI;