/**
 * Format file size from bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get pricing tier based on file size
 * @param {number} bytes - File size in bytes
 * @returns {Object} Pricing tier information
 */
export const getPricingTier = (bytes) => {
  const mb = bytes / (1024 * 1024);
  const gb = bytes / (1024 * 1024 * 1024);
  
  if (mb <= 100) {
    return { tier: 'free', price: 0, label: 'Free', color: 'green' };
  } else if (gb <= 1) {
    return { tier: 'premium', price: 3, label: '$3', color: 'blue' };
  } else if (gb <= 5) {
    return { tier: 'large', price: 8, label: '$8', color: 'purple' };
  } else {
    return { tier: 'invalid', price: null, label: 'Too Large', color: 'red' };
  }
};

/**
 * Calculate total pricing for multiple files
 * @param {Array<File>} files - Array of file objects
 * @returns {Object} Total pricing information
 */
export const calculateTotalPricing = (files) => {
  if (!files || files.length === 0) {
    return {
      totalSize: 0,
      totalPrice: 0,
      fileCount: 0,
      formattedSize: '0 Bytes',
      requiresPayment: false,
      tier: { tier: 'free', price: 0, label: 'Free', color: 'green' }
    };
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const pricing = getPricingTier(totalSize);
  
  return {
    totalSize,
    totalPrice: pricing.price || 0,
    fileCount: files.length,
    formattedSize: formatFileSize(totalSize),
    requiresPayment: pricing.price > 0,
    tier: pricing
  };
};

/**
 * Validate multiple files
 * @param {Array<File>} files - Array of file objects
 * @param {number} maxFiles - Maximum number of files allowed
 * @returns {Object} Validation result
 */
export const validateFiles = (files, maxFiles = 5) => {
  if (!files || files.length === 0) {
    return { isValid: false, error: 'No files selected' };
  }

  if (files.length > maxFiles) {
    return { isValid: false, error: `Maximum ${maxFiles} files allowed` };
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB total

  if (totalSize > maxSize) {
    return { isValid: false, error: 'Total file size exceeds 5GB maximum' };
  }

  // Check individual file sizes
  const invalidFiles = files.filter(file => file.size > maxSize);
  if (invalidFiles.length > 0) {
    return { 
      isValid: false, 
      error: `File "${invalidFiles[0].name}" exceeds 5GB maximum` 
    };
  }

  return { isValid: true, error: null };
};

/**
 * Get appropriate icon name based on file type
 * @param {string} fileType - MIME type of the file
 * @returns {string} Icon name for Lucide React
 */
export const getFileIconName = (fileType) => {
  if (fileType.startsWith('image/')) return 'Image';
  if (fileType.startsWith('video/')) return 'Video';
  if (fileType.startsWith('audio/')) return 'Music';
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return 'Archive';
  if (fileType.includes('text') || fileType.includes('document')) return 'FileText';
  return 'File';
};

/**
 * Validate file size
 * @param {number} bytes - File size in bytes
 * @returns {Object} Validation result
 */
export const validateFileSize = (bytes) => {
  const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
  return {
    isValid: bytes <= maxSize,
    error: bytes > maxSize ? 'File exceeds maximum size of 5GB' : null
  };
};

/**
 * Get file extension from filename
 * @param {string} filename - Name of the file
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};