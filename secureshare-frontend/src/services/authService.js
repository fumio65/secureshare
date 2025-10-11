// src/services/authService.js
// Fixed to match backend field names: current_password, new_password, new_password_confirm

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class AuthService {
  constructor() {
    this.refreshPromise = null;
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      try {
        await this.refreshTokenIfNeeded();
        const newToken = this.getAccessToken();
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
        });
        return retryResponse;
      } catch (refreshError) {
        this.clearTokens();
        throw new Error('Session expired. Please log in again.');
      }
    }

    return response;
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errors = data.errors;
          if (errors.email && Array.isArray(errors.email)) {
            throw new Error(errors.email[0]);
          }
          if (errors.password && Array.isArray(errors.password)) {
            throw new Error(errors.password[0]);
          }
          if (errors.username && Array.isArray(errors.username)) {
            throw new Error(errors.username[0]);
          }
          if (errors.first_name && Array.isArray(errors.first_name)) {
            throw new Error(errors.first_name[0]);
          }
          if (errors.last_name && Array.isArray(errors.last_name)) {
            throw new Error(errors.last_name[0]);
          }
          if (errors.password_confirm && Array.isArray(errors.password_confirm)) {
            throw new Error(errors.password_confirm[0]);
          }
          if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
            throw new Error(errors.non_field_errors[0]);
          }
        }
        if (data.email && Array.isArray(data.email)) {
          throw new Error(data.email[0]);
        }
        if (data.password && Array.isArray(data.password)) {
          throw new Error(data.password[0]);
        }
        throw new Error(data.detail || data.message || 'Registration failed');
      }

      if (data.access && data.refresh) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
      }

      return data;
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password. Please check your credentials.');
        }
        throw new Error(data.detail || data.message || 'Login failed');
      }

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      return data;
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAccessToken()}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.warn('Logout request failed:', error.message);
      }
    }

    this.clearTokens();
  }

  async refreshTokenIfNeeded() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken);
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  async performTokenRefresh(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      
      return data;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await this.makeAuthenticatedRequest(`${API_BASE_URL}/auth/profile/`);

      if (!response.ok) {
        throw new Error('Failed to get profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await this.makeAuthenticatedRequest(`${API_BASE_URL}/auth/profile/`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async changePassword(passwordData) {
    try {
      console.log('🔐 AuthService: Starting password change request...');
      console.log('📍 API Base URL:', API_BASE_URL);
      console.log('📍 Full URL:', `${API_BASE_URL}/auth/change-password/`);
      
      // CRITICAL FIX: Backend expects different field names!
      // Frontend uses: old_password, new_password
      // Backend expects: current_password, new_password, new_password_confirm
      const backendPasswordData = {
        current_password: passwordData.old_password,
        new_password: passwordData.new_password,
        new_password_confirm: passwordData.new_password  // Backend requires confirmation
      };
      
      console.log('📝 Frontend data (old_password):', { 
        old_password: passwordData.old_password ? '***' : 'missing',
        new_password: passwordData.new_password ? '***' : 'missing'
      });
      
      console.log('📝 Backend data (current_password):', { 
        current_password: backendPasswordData.current_password ? '***' : 'missing',
        new_password: backendPasswordData.new_password ? '***' : 'missing',
        new_password_confirm: backendPasswordData.new_password_confirm ? '***' : 'missing'
      });
      
      const token = this.getAccessToken();
      console.log('🔑 Access token:', token ? `${token.substring(0, 20)}...` : 'MISSING!');
      
      const response = await this.makeAuthenticatedRequest(`${API_BASE_URL}/auth/change-password/`, {
        method: 'POST',
        body: JSON.stringify(backendPasswordData),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const data = await response.json();
        console.error('❌ Error response data:', data);
        
        // Handle specific backend errors (using backend field names)
        if (data.errors) {
          if (data.errors.current_password) {
            const errorMsg = Array.isArray(data.errors.current_password) 
              ? data.errors.current_password[0] 
              : data.errors.current_password;
            throw new Error(errorMsg === 'Current password is incorrect.' ? 'Current password is incorrect' : errorMsg);
          }
          if (data.errors.new_password) {
            const errorMsg = Array.isArray(data.errors.new_password) 
              ? data.errors.new_password[0] 
              : data.errors.new_password;
            throw new Error(errorMsg);
          }
          if (data.errors.new_password_confirm) {
            const errorMsg = Array.isArray(data.errors.new_password_confirm) 
              ? data.errors.new_password_confirm[0] 
              : data.errors.new_password_confirm;
            throw new Error(errorMsg);
          }
        }
        
        if (data.detail) {
          throw new Error(data.detail);
        }
        if (data.message) {
          throw new Error(data.message);
        }
        
        throw new Error('Failed to change password. Please try again.');
      }

      const result = await response.json();
      console.log('✅ Password change successful:', result);
      return result;
    } catch (error) {
      console.error('❌ AuthService changePassword error:', error);
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error message:', error.message);
      throw error;
    }
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > (currentTime + 300);
    } catch (error) {
      console.warn('Invalid token format:', error);
      return false;
    }
  }

  getTokenExpirationTime() {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();