export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

export const handleAPIError = (error, response = null) => {
  // Network or fetch errors
  if (!response) {
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return new APIError('Network error. Please check your internet connection.', 0);
    }
    return new APIError(error.message || 'An unexpected error occurred.', 0);
  }

  // HTTP errors with response
  const status = response.status;
  
  switch (status) {
    case 400:
      return new APIError('Invalid request. Please check your input.', status);
    case 401:
      return new APIError('Authentication failed. Please log in again.', status);
    case 403:
      return new APIError('Access denied. You don\'t have permission to perform this action.', status);
    case 404:
      return new APIError('The requested resource was not found.', status);
    case 429:
      return new APIError('Too many requests. Please wait a moment and try again.', status);
    case 500:
      return new APIError('Server error. Please try again later.', status);
    case 502:
    case 503:
    case 504:
      return new APIError('Service temporarily unavailable. Please try again later.', status);
    default:
      return new APIError(`HTTP error ${status}. Please try again.`, status);
  }
};

export const formatValidationErrors = (errorData) => {
  if (typeof errorData === 'string') {
    return errorData;
  }

  if (Array.isArray(errorData)) {
    return errorData.join(', ');
  }

  if (typeof errorData === 'object') {
    const errors = [];
    
    for (const [field, messages] of Object.entries(errorData)) {
      if (Array.isArray(messages)) {
        errors.push(`${field}: ${messages.join(', ')}`);
      } else {
        errors.push(`${field}: ${messages}`);
      }
    }
    
    return errors.join('\n');
  }

  return 'Validation error occurred.';
};