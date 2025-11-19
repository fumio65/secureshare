import React, { useState, useRef } from 'react';
import { Upload, Files, Plus } from 'lucide-react';

/**
 * DragDropArea Component
 * Provides drag-and-drop file upload interface with browse button fallback
 * 
 * @param {Function} onFileSelect - Callback when files are selected (receives array of files)
 * @param {boolean} disabled - Whether the component is disabled
 * @param {boolean} multiple - Allow multiple file selection (default: true)
 * @param {number} maxFiles - Maximum number of files allowed (default: 5)
 * @param {boolean} addMode - If true, adds to existing files instead of replacing (default: false)
 */
const DragDropArea = ({ onFileSelect, disabled = false, multiple = true, maxFiles = 5, addMode = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    console.log('📁 DROP - Files dropped:', droppedFiles.length);
    
    if (droppedFiles && droppedFiles.length > 0) {
      if (droppedFiles.length > maxFiles && !addMode) {
        alert(`Maximum ${maxFiles} files allowed. Only the first ${maxFiles} files will be selected.`);
        const limitedFiles = droppedFiles.slice(0, maxFiles);
        onFileSelect(limitedFiles);
      } else {
        onFileSelect(droppedFiles);
      }
    }
  };

  const handleFileInput = (e) => {
    if (disabled) return;
    
    const selectedFiles = e.target.files;
    console.log('📁 BROWSE - Files selected:', selectedFiles ? selectedFiles.length : 0);
    console.log('📁 BROWSE - FileList object:', selectedFiles);
    
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles);
      console.log('📁 BROWSE - Converted to array:', filesArray.length);
      console.log('📁 BROWSE - Files:', filesArray.map(f => f.name));
      
      if (filesArray.length > maxFiles && !addMode) {
        alert(`Maximum ${maxFiles} files allowed. Only the first ${maxFiles} files will be selected.`);
        const limitedFiles = filesArray.slice(0, maxFiles);
        onFileSelect(limitedFiles);
      } else {
        onFileSelect(filesArray);
      }
    }
    
    // Reset input value to allow selecting the same files again
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl transition-all duration-300
        ${addMode ? 'p-4' : 'p-6 sm:p-8'}
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInput}
        disabled={disabled}
        multiple={multiple}
        accept="*/*"
        aria-label="File upload input"
      />

      {addMode ? (
        // Compact "Add More" version
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Add More Files
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Drag & drop or click to browse
            </p>
          </div>
        </div>
      ) : (
        // Full upload area version
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`
            p-3 rounded-full transition-colors duration-300
            ${isDragging 
              ? 'bg-blue-100 dark:bg-blue-800' 
              : 'bg-gray-100 dark:bg-gray-800'
            }
          `}>
            {multiple ? (
              <Files className={`
                w-10 h-10 transition-colors duration-300
                ${isDragging 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500'
                }
              `} />
            ) : (
              <Upload className={`
                w-10 h-10 transition-colors duration-300
                ${isDragging 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500'
                }
              `} />
            )}
          </div>

          <div className="text-center">
            <p className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
              {isDragging 
                ? `Drop your ${multiple ? 'files' : 'file'} here` 
                : multiple 
                  ? `Drag & drop up to ${maxFiles} files here` 
                  : 'Drag & drop your file here'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              or click to browse
            </p>
            
            {multiple && (
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  💡 Select multiple files in file picker or drag multiple files together
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
              <span>Maximum total size: 5GB</span>
              <span>•</span>
              <span>All file types supported</span>
            </div>
          </div>

          {!disabled && (
            <button
              type="button"
              className="
                px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium
                rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm
                flex items-center space-x-2
              "
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              {multiple ? <Files className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              <span>Browse {multiple ? 'Files' : 'File'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DragDropArea;