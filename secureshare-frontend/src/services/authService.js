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

    // If token is expired, try to refresh it
    if (response.status === 401) {
      try {
        await this.refreshTokenIfNeeded();
        // Retry the original request with new token
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
        // If refresh fails, logout user
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
        // Handle validation errors
        if (data.email && Array.isArray(data.email)) {
          throw new Error(data.email[0]);
        }
        if (data.password && Array.isArray(data.password)) {
          throw new Error(data.password[0]);
        }
        throw new Error(data.detail || data.message || 'Registration failed');
      }

      // Store tokens if returned
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

      // Store tokens
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
        // Continue with local logout even if server request fails
      }
    }

    this.clearTokens();
  }

  async refreshTokenIfNeeded() {
    // Prevent multiple simultaneous refresh requests
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
      
      // Update refresh token if provided
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
      const response = await this.makeAuthenticatedRequest(`${API_BASE_URL}/auth/change-password/`, {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.old_password) {
          throw new Error('Current password is incorrect');
        }
        if (data.new_password) {
          throw new Error(data.new_password[0] || 'New password is invalid');
        }
        throw new Error(data.detail || 'Failed to change password');
      }

      return await response.json();
    } catch (error) {
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
      // Basic token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // If token expires in less than 5 minutes, consider it invalid
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
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();