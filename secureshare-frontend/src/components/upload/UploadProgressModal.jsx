// src/components/upload/UploadProgressModal.jsx
// UPDATED: For ZIP archive approach (ONE link, ONE password)

import React, { useState } from 'react';
import { CheckCircle, Copy, Link2, Lock, AlertCircle, Loader, X, ExternalLink, FileArchive, File } from 'lucide-react';
import CustomButton from '../forms/CustomButton';

/**
 * UploadProgressModal Component
 * Shows real-time upload progress with password and link display
 * ZIP Archive Approach: Multiple files = ONE link, ONE password
 * 
 * @param {boolean} isOpen - Modal visibility
 * @param {Function} onClose - Close handler
 * @param {Object} uploadInfo - Single upload object with files array
 * @param {number} progress - Overall progress (0-100)
 * @param {string} currentStatus - Current status message
 * @param {boolean} isUploading - Upload in progress
 * @param {string} error - Error message if failed
 */
const UploadProgressModal = ({ 
  isOpen, 
  onClose, 
  uploadInfo = null, 
  progress = 0,
  currentStatus = '',
  isUploading = false,
  error = null
}) => {
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const isCompleted = uploadInfo?.status === 'completed';
  const hasError = !!error;

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'password') {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={isCompleted ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isCompleted ? '✅ Upload Complete!' : hasError ? '❌ Upload Failed' : '⏫ Uploading Files...'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isCompleted 
                    ? uploadInfo?.isZip 
                      ? `${uploadInfo.fileCount} files packaged in ZIP archive`
                      : '1 file uploaded successfully'
                    : hasError
                    ? error
                    : currentStatus || 'Processing...'
                  }
                </p>
              </div>
              {isCompleted && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {/* Upload in Progress */}
            {isUploading && !isCompleted && !hasError && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">{currentStatus}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {/* Loading Animation */}
                <div className="flex items-center justify-center mt-6">
                  <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="mb-6">
                <div className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                        Upload Failed
                      </p>
                      <p className="text-xs text-red-800 dark:text-red-200">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success State - Show ZIP/File Info */}
            {isCompleted && uploadInfo && (
              <div className="space-y-4">
                {/* ZIP Archive Info */}
                <div className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {uploadInfo.isZip ? (
                          <FileArchive className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <File className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                          {uploadInfo.filename}
                        </p>
                      </div>
                      <p className="text-xs text-green-800 dark:text-green-200">
                        {uploadInfo.isZip 
                          ? `Contains ${uploadInfo.fileCount} files • ${formatFileSize(uploadInfo.totalSize)}`
                          : formatFileSize(uploadInfo.totalSize)
                        }
                      </p>
                    </div>
                  </div>

                  {/* Files in ZIP */}
                  {uploadInfo.isZip && uploadInfo.files && (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                      <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-2">
                        📦 Files included in archive:
                      </p>
                      <ul className="space-y-1">
                        {uploadInfo.files.map((file, index) => (
                          <li key={index} className="text-xs text-green-800 dark:text-green-200 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full"></span>
                            <span className="truncate">{file.filename}</span>
                            <span className="text-green-600 dark:text-green-400">
                              ({formatFileSize(file.file_size)})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ONE Password Display */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      🔐 Download Password
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-lg font-mono font-bold bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100">
                      {uploadInfo.password}
                    </code>
                    <button
                      onClick={() => copyToClipboard(uploadInfo.password, 'password')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Copy password"
                    >
                      {copiedPassword ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  {copiedPassword && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Copied to clipboard!
                    </p>
                  )}
                </div>

                {/* ONE Download Link */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Link2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      🔗 Download Link
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={uploadInfo.downloadLink}
                      readOnly
                      className="flex-1 text-sm bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100 focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => copyToClipboard(uploadInfo.downloadLink, 'link')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Copy link"
                    >
                      {copiedLink ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  {copiedLink && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Security Best Practices */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        🔒 Two-Channel Security Best Practice
                      </p>
                      <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
                        <li>• Send the <strong>download link</strong> via one channel (e.g., Email)</li>
                        <li>• Send the <strong>password</strong> via a different channel (e.g., SMS or messaging app)</li>
                        <li>• This prevents interception of both pieces of information</li>
                        <li>• {uploadInfo.isZip ? 'Recipients will download a ZIP file containing all files' : 'Recipients will download the file directly'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            {isCompleted ? (
              <div className="flex justify-between items-center">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  Close
                </CustomButton>
                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    // Could trigger navigation to history page
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Transfer History
                </CustomButton>
              </div>
            ) : hasError ? (
              <div className="flex justify-center">
                <CustomButton
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                >
                  Try Again
                </CustomButton>
              </div>
            ) : (
              <div className="flex justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please wait while your {uploadInfo?.fileCount > 1 ? 'files are being packaged and ' : 'file is being '}uploaded...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProgressModal;