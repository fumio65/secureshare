// FILE 1: src/pages/UploadTest.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DragDropArea from '../components/upload/DragDropArea';
import { ArrowLeft, CheckCircle, FileText } from 'lucide-react';

const UploadTest = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    console.log('📁 File selected:', file);
    if (file) {
      console.log('📊 File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Test File Upload
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Try dragging and dropping a file or click to browse
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <DragDropArea 
            onFileSelect={handleFileSelect}
            maxSize={5 * 1024 * 1024 * 1024} // 5GB
          />
        </div>

        {/* File Details Card */}
        {selectedFile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                File Selected Successfully
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    File Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1 break-all">
                    {selectedFile.name}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    File Size
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    File Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {selectedFile.type || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Modified
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {new Date(selectedFile.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setSelectedFile(null);
              console.log('🔄 Reset file selection');
            }}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
          
          <button
            disabled={!selectedFile}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              selectedFile
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Upload
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Testing Instructions
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>Try dragging a file from your computer and dropping it in the upload area</li>
            <li>Try clicking the upload area to browse for a file</li>
            <li>Try uploading files larger than 5GB to test validation</li>
            <li>Try removing a file and selecting a new one</li>
            <li>Check the browser console for detailed file information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadTest;

// FILE 2: Add this route to App.jsx
/*
import UploadTest from './pages/UploadTest';

// In your Routes:
<Route path="/upload-test" element={<UploadTest />} />

// Or make it protected:
<Route 
  path="/upload-test" 
  element={
    <ProtectedRoute>
      <UploadTest />
    </ProtectedRoute>
  } 
/>
*/