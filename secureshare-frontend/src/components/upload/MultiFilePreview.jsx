import React from 'react';
import { File, FileText, Image, Video, Music, Archive, X, Check, AlertCircle, DollarSign } from 'lucide-react';
import { formatFileSize, getPricingTier, calculateTotalPricing } from '../../utils/fileUtils';

/**
 * Get file icon based on type
 */
const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return Image;
  if (fileType.startsWith('video/')) return Video;
  if (fileType.startsWith('audio/')) return Music;
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return Archive;
  if (fileType.includes('text') || fileType.includes('document')) return FileText;
  return File;
};

/**
 * MultiFilePreview Component
 * Displays multiple selected files with total pricing
 * 
 * @param {Array<File>} files - Array of selected file objects
 * @param {Function} onRemove - Callback to remove a file (receives file index)
 * @param {Function} onRemoveAll - Callback to remove all files
 */
const MultiFilePreview = ({ files, onRemove, onRemoveAll }) => {
  console.log('🎨 MultiFilePreview rendering with files:', files);
  console.log('🎨 Files count:', files.length);
  console.log('🎨 Files is array:', Array.isArray(files));
  
  const totalPricing = calculateTotalPricing(files);
  const allValid = files.every(file => getPricingTier(file.size).tier !== 'invalid');

  const tierColors = {
    free: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    premium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    large: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    invalid: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div className="space-y-3">
      {/* Total Summary */}
      <div className={`
        border-2 rounded-xl p-4 transition-all duration-300
        ${allValid 
          ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10' 
          : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`
              p-2 rounded-lg
              ${allValid ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30'}
            `}>
              <DollarSign className={`
                w-5 h-5
                ${allValid ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}
              `} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {totalPricing.fileCount} {totalPricing.fileCount === 1 ? 'File' : 'Files'} Selected
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total: {totalPricing.formattedSize}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${tierColors[totalPricing.tier.tier]}
            `}>
              {totalPricing.tier.label}
            </span>
            <button
              onClick={onRemoveAll}
              className="
                p-1.5 rounded-lg transition-colors duration-200
                hover:bg-red-100 dark:hover:bg-red-900/30
                text-red-600 dark:text-red-400
              "
              aria-label="Remove all files"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Individual Files */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {files.map((file, index) => {
          console.log(`🎨 Rendering file ${index + 1}:`, file.name);
          
          const FileIcon = getFileIcon(file.type);
          const pricing = getPricingTier(file.size);
          const isValid = pricing.tier !== 'invalid';

          return (
            <div
              key={`${file.name}-${index}`}
              className={`
                border rounded-lg p-3 transition-all duration-200
                ${isValid 
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' 
                  : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-lg shrink-0
                  ${isValid ? 'bg-gray-100 dark:bg-gray-700' : 'bg-red-100 dark:bg-red-900/30'}
                `}>
                  <FileIcon className={`
                    w-5 h-5
                    ${isValid ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}
                  `} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                    {file.type && (
                      <span className="ml-1">
                        • {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                      </span>
                    )}
                  </p>
                </div>

                {isValid ? (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                )}

                <button
                  onClick={() => onRemove(index)}
                  className="
                    p-1 rounded-lg transition-colors duration-200 shrink-0
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    text-gray-500 dark:text-gray-400
                  "
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Information */}
      {allValid && totalPricing.requiresPayment && (
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            These files require a <span className="font-semibold text-gray-900 dark:text-gray-100">${totalPricing.totalPrice}</span> payment to upload.
            Files under 100MB total are free.
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiFilePreview;
