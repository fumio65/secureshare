import React, { useState } from 'react';

const RegistrationDebug = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testRegistration = async () => {
    setIsLoading(true);
    setDebugInfo(null);

    const testData = {
      first_name: "Debug",
      last_name: "Test",
      email: `debug${Date.now()}@example.com`,
      password: "TestPassword123",
      password_confirm: "TestPassword123"
    };

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      
      console.log('Testing registration with:', { ...testData, password: '[HIDDEN]', password_confirm: '[HIDDEN]' });
      
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const responseData = await response.json();
      
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        success: response.ok
      });

    } catch (error) {
      setDebugInfo({
        error: error.message,
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Registration Debug Tool
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This tool helps debug registration issues by testing the API directly.
      </p>

      <button
        onClick={testRegistration}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Registration API'}
      </button>

      {debugInfo && (
        <div className="mt-6 space-y-4">
          <div className={`p-4 rounded-lg ${debugInfo.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <h3 className={`font-semibold ${debugInfo.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
              {debugInfo.success ? '✅ Success' : '❌ Failed'}
            </h3>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response Details:</h4>
            <div className="space-y-2 text-sm">
              {debugInfo.status && (
                <div>
                  <span className="font-medium">Status:</span> {debugInfo.status} {debugInfo.statusText}
                </div>
              )}
              {debugInfo.error && (
                <div>
                  <span className="font-medium text-red-600">Error:</span> {debugInfo.error}
                </div>
              )}
            </div>
          </div>

          {debugInfo.data && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response Data:</h4>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                {JSON.stringify(debugInfo.data, null, 2)}
              </pre>
            </div>
          )}

          {debugInfo.headers && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Response Headers:</h4>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                {JSON.stringify(debugInfo.headers, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Debug Checklist:</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>✓ Check if backend server is running on localhost:8000</li>
          <li>✓ Verify all required fields are being sent (first_name, last_name, email, password, password_confirm)</li>
          <li>✓ Ensure password and password_confirm match</li>
          <li>✓ Check for CORS issues</li>
          <li>✓ Verify API endpoint URL is correct</li>
        </ul>
      </div>
    </div>
  );
};

export default RegistrationDebug;