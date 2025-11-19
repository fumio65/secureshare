import React, { useState } from 'react';
import { DragDropArea, FilePreview } from '../components/upload';
import { Check } from 'lucide-react';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    console.log('File selected:', file);
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Upload Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Upload Your File
            </h2>
            
            {!selectedFile ? (
              <DragDropArea onFileSelect={handleFileSelect} />
            ) : (
              <FilePreview file={selectedFile} onRemove={handleRemoveFile} />
            )}
          </div>

          {/* Pricing Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pricing Tiers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border-2 border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-green-800 dark:text-green-400">Free</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">$0</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Files up to 100MB
                </p>
              </div>
              
              <div className="p-4 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-400">Premium</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">$3</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  100MB - 1GB
                </p>
              </div>
              
              <div className="p-4 border-2 border-purple-300 dark:border-purple-700 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-800 dark:text-purple-400">Large</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">$8</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  1GB - 5GB
                </p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Drag & drop file upload</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Real-time file validation</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Automatic pricing calculation</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>File type detection with icons</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Mobile responsive design</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Dark/light theme support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;