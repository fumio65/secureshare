// src/services/filesAPI.js

/**
 * API Service for File Operations
 * Handles all file-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Get authorization header with token
 */
const getAuthHeader = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || `HTTP ${response.status}`);
  }
  return await response.json();
};

// ============================================================================
// FILE UPLOAD OPERATIONS
// ============================================================================

/**
 * Create upload entries for multiple files
 * @param {Array} files - Array of {filename, file_size, mime_type}
 * @param {string} token - Auth token
 * @returns {Promise} Upload entries data
 */
export const createBulkUploadEntries = async (files, token) => {
  const response = await fetch(`${API_BASE_URL}/files/bulk/create/`, {
    method: 'POST',
    headers: getAuthHeader(token),
    body: JSON.stringify({ files })
  });
  return handleResponse(response);
};

/**
 * Upload file content
 * @param {string} uploadId - Upload entry ID
 * @param {File} file - File object
 * @param {string} token - Auth token
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Upload result
 */
export const uploadFileContent = async (uploadId, file, token, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (err) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    // Send request
    xhr.open('POST', `${API_BASE_URL}/files/${uploadId}/upload/`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};

// ============================================================================
// TRANSFER HISTORY OPERATIONS
// ============================================================================

/**
 * Get transfer history with statistics
 * @param {string} token - Auth token
 * @returns {Promise} Transfer history data
 */
export const getTransferHistory = async (token) => {
  const response = await fetch(`${API_BASE_URL}/files/history/`, {
    method: 'GET',
    headers: getAuthHeader(token)
  });
  return handleResponse(response);
};

/**
 * Get all user uploads
 * @param {string} token - Auth token
 * @returns {Promise} List of uploads
 */
export const getUserUploads = async (token) => {
  const response = await fetch(`${API_BASE_URL}/files/`, {
    method: 'GET',
    headers: getAuthHeader(token)
  });
  return handleResponse(response);
};

/**
 * Get single upload details
 * @param {string} uploadId - Upload ID
 * @param {string} token - Auth token
 * @returns {Promise} Upload details
 */
export const getUploadDetails = async (uploadId, token) => {
  const response = await fetch(`${API_BASE_URL}/files/${uploadId}/`, {
    method: 'GET',
    headers: getAuthHeader(token)
  });
  return handleResponse(response);
};

/**
 * Delete upload
 * @param {string} uploadId - Upload ID
 * @param {string} token - Auth token
 * @returns {Promise} Deletion result
 */
export const deleteUpload = async (uploadId, token) => {
  const response = await fetch(`${API_BASE_URL}/files/${uploadId}/`, {
    method: 'DELETE',
    headers: getAuthHeader(token)
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete upload');
  }
  
  return { success: true };
};

// ============================================================================
// SHARE LINK OPERATIONS
// ============================================================================

/**
 * Get share link for upload
 * @param {string} uploadId - Upload ID
 * @param {string} token - Auth token
 * @returns {Promise} Share link data
 */
export const getShareLink = async (uploadId, token) => {
  const response = await fetch(`${API_BASE_URL}/files/${uploadId}/share-link/`, {
    method: 'GET',
    headers: getAuthHeader(token)
  });
  return handleResponse(response);
};

// ============================================================================
// DOWNLOAD OPERATIONS (PUBLIC)
// ============================================================================

/**
 * Get download info (no auth required)
 * @param {string} downloadToken - Download token
 * @returns {Promise} File info
 */
export const getDownloadInfo = async (downloadToken) => {
  const response = await fetch(`${API_BASE_URL}/files/download/${downloadToken}/`, {
    method: 'GET'
  });
  return handleResponse(response);
};

/**
 * Download file with password (no auth required)
 * @param {string} downloadToken - Download token
 * @param {string} password - Download password
 * @returns {Promise} File blob
 */
export const downloadFile = async (downloadToken, password) => {
  const response = await fetch(`${API_BASE_URL}/files/download/${downloadToken}/file/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Download failed' }));
    throw new Error(error.error || 'Download failed');
  }

  return response.blob();
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format file size to human-readable
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get pricing tier badge color
 * @param {string} tier - Pricing tier (free/premium/large)
 * @returns {object} Tailwind color classes
 */
export const getTierColors = (tier) => {
  const colors = {
    free: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800'
    },
    premium: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800'
    },
    large: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800'
    }
  };
  
  return colors[tier] || colors.free;
};

/**
 * Get status badge color
 * @param {string} status - Upload status
 * @returns {object} Tailwind color classes
 */
export const getStatusColors = (status) => {
  const colors = {
    completed: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-400'
    },
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-400'
    },
    processing: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-400'
    },
    failed: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-400'
    },
    expired: {
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      text: 'text-gray-800 dark:text-gray-400'
    }
  };
  
  return colors[status] || colors.pending;
};

export default {
  createBulkUploadEntries,
  uploadFileContent,
  getTransferHistory,
  getUserUploads,
  getUploadDetails,
  deleteUpload,
  getShareLink,
  getDownloadInfo,
  downloadFile,
  formatFileSize,
  formatDate,
  getTierColors,
  getStatusColors
};