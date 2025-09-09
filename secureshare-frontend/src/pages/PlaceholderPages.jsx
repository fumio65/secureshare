import React from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Dashboard, Download, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to SecureShare
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access your secure file transfers
          </p>
        </div>
        <div className="card p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-4">🚧 Login form will be implemented in Phase 3</p>
            <p className="text-sm mb-6">Authentication system coming soon...</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start sharing files securely today
          </p>
        </div>
        <div className="card p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-4">🚧 Registration form will be implemented in Phase 3</p>
            <p className="text-sm mb-6">User registration system coming soon...</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-12">
      <div className="container-custom">
        <div className="text-center mb-8">
          <Dashboard className="mx-auto h-12 w-12 text-primary-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your secure file transfers
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="mb-4">🚧 Dashboard will be implemented in Phase 4+</p>
              <p className="text-sm mb-6">File upload, transfer history, and management tools coming soon...</p>
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DownloadPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Download className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Secure Download
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter password to access your file
          </p>
        </div>
        <div className="card p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-4">🚧 Download system will be implemented in Phase 6+</p>
            <p className="text-sm mb-6">Secure file download with password protection coming soon...</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};