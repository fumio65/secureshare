// FILE 1: src/components/upload/DragDropArea.jsx
import React, { useState, useRef } from 'react';
import { Upload, File, X, AlertCircle, Plus } from 'lucide-react';

const DragDropArea = ({ 
  onFileSelect, 
  maxSize = 5 * 1024 * 1024 * 1024, 
  accept = null,
  multiple = true,
  maxFiles = 10 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      const maxSizeGB = maxSize / (1024 * 1024 * 1024);
      return `File "${file.name}" exceeds ${maxSizeGB}GB limit`;
    }

    // Check if file is empty
    if (file.size === 0) {
      return `File "${file.name}" is empty`;
    }

    // Check for duplicate names
    if (selectedFiles.some(f => f.name === file.name)) {
      return `File "${file.name}" is already added`;
    }

    return null;
  };

  const addFiles = (newFiles) => {
    setError('');
    const errors = [];
    const validFiles = [];

    // Check total file count
    if (selectedFiles.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You can only add ${maxFiles - selectedFiles.length} more file(s).`);
      return;
    }

    for (const file of newFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      // Add new files at the beginning (most recent first)
      const updatedFiles = [...validFiles, ...selectedFiles];
      setSelectedFiles(updatedFiles);
      onFileSelect(updatedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      addFiles(files);
    }
    // Reset input so same file can be selected again if removed
    e.target.value = '';
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    setError('');
    onFileSelect(updatedFiles);
  };

  const handleRemoveAll = () => {
    setSelectedFiles([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect([]);
  };

  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-4 rounded-full transition-colors
            ${isDragging
              ? 'bg-blue-100 dark:bg-blue-800'
              : 'bg-gray-100 dark:bg-gray-700'
            }
          `}>
            {selectedFiles.length > 0 ? (
              <Plus className={`
                h-12 w-12 transition-colors
                ${isDragging
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500'
                }
              `} />
            ) : (
              <Upload className={`
                h-12 w-12 transition-colors
                ${isDragging
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500'
                }
              `} />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {isDragging 
                ? 'Drop your files here' 
                : selectedFiles.length > 0 
                ? 'Add more files'
                : 'Drag & drop your files here'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse
            </p>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Maximum file size: {maxSize / (1024 * 1024 * 1024)}GB per file</p>
            {multiple && <p>Up to {maxFiles} files • {selectedFiles.length}/{maxFiles} selected</p>}
          </div>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" />
        )}
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total: {formatFileSize(getTotalSize())}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAll();
                }}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                Remove All
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <FilePreview 
                key={`${file.name}-${index}`}
                file={file} 
                onRemove={() => handleRemoveFile(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start space-x-2 text-red-800 dark:text-red-200 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="whitespace-pre-line">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// FILE 2: src/components/upload/FilePreview.jsx
const FilePreview = ({ file, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const iconColors = {
      // Documents
      pdf: 'text-red-500',
      doc: 'text-blue-500',
      docx: 'text-blue-500',
      txt: 'text-gray-500',
      
      // Images
      jpg: 'text-green-500',
      jpeg: 'text-green-500',
      png: 'text-green-500',
      gif: 'text-green-500',
      svg: 'text-green-500',
      webp: 'text-green-500',
      
      // Videos
      mp4: 'text-purple-500',
      avi: 'text-purple-500',
      mov: 'text-purple-500',
      mkv: 'text-purple-500',
      
      // Archives
      zip: 'text-yellow-500',
      rar: 'text-yellow-500',
      '7z': 'text-yellow-500',
      tar: 'text-yellow-500',
      gz: 'text-yellow-500',
      
      // Code
      js: 'text-yellow-400',
      jsx: 'text-cyan-500',
      ts: 'text-blue-400',
      tsx: 'text-cyan-400',
      py: 'text-yellow-600',
      java: 'text-red-400',
      cpp: 'text-blue-600',
      
      // Default
      default: 'text-gray-400'
    };

    return iconColors[extension] || iconColors.default;
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  return (
    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${getFileIcon(file.name)} flex-shrink-0`}>
          <File className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {file.name}
          </p>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)}
            </span>
            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
              {getFileType(file.name)}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex-shrink-0 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
          aria-label="Remove file"
        >
          <X className="h-5 w-5 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default DragDropArea;
export { FilePreview };