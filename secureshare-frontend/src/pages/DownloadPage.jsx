// src/pages/DownloadPage.jsx
// Public page for downloading password-protected files

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Download, Lock, FileText, AlertCircle, Loader } from 'lucide-react';
import CustomButton from '../components/forms/CustomButton';

const DownloadPage = () => {
  const { downloadToken } = useParams();
  const [password, setPassword] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchFileInfo();
  }, [downloadToken]);

  const fetchFileInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/files/download/${downloadToken}/`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('File not found or has expired');
        }
        throw new Error('Failed to fetch file information');
      }

      const data = await response.json();
      setFileInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/files/download/${downloadToken}/file/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password.trim() }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Incorrect password. Please try again.');
        }
        if (response.status === 410) {
          throw new Error('This file has expired and is no longer available.');
        }
        throw new Error('Download failed. Please try again.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileInfo.filename || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setError(null);
      alert('Download started successfully!');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading file information...</p>
        </div>
      </div>
    );
  }

  if (error && !fileInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            File Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <CustomButton
            variant="primary"
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                SecureShare
              </span>
            </div>
            <a
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Create Your Own Secure Transfer
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-white/10 rounded-full">
                <FileText className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              {fileInfo?.filename}
            </h1>
            <p className="text-blue-100 text-center text-sm">
              {formatFileSize(fileInfo?.file_size)} • {fileInfo?.download_count || 0} downloads
            </p>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-4">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">This file is password protected</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter the password that was shared with you to download this file.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={downloading}
                    onKeyPress={(e) => e.key === 'Enter' && handleDownload(e)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <CustomButton
                onClick={handleDownload}
                variant="primary"
                className="w-full"
                disabled={downloading || !password.trim()}
              >
                {downloading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download File
                  </>
                )}
              </CustomButton>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    🔒 Secure Download
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    This file is encrypted with military-grade AES-256 encryption.
                  </p>
                </div>
              </div>
            </div>

            {fileInfo?.expires_at && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This download link expires on{' '}
                  {new Date(fileInfo.expires_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Want to send files securely too?
          </p>
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Create your free SecureShare account
          </a>
        </div>
      </main>
    </div>
  );
};

export default DownloadPage;