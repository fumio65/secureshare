// src/components/layout/Dashboard.jsx
// Complete version with working Change Password button

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import AuthStatus from '../auth/AuthStatus';
import CustomButton from '../forms/CustomButton';
import ChangePasswordModal from '../auth/ChangePasswordModal';
import { Upload, History, Settings, User, Shield, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Upload },
    { id: 'history', label: 'Transfer History', icon: History },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Auth Status Banner */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <AuthStatus />
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload and share files securely with automatic password protection.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Uploads
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {user?.total_uploads || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <History className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Storage Used
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {user?.storage_used ? `${(user.storage_used / (1024 * 1024)).toFixed(1)} MB` : '0 MB'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Links
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {user?.active_transfers || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Area Placeholder */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Upload
                </h2>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Drag and drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Files up to 5GB • All files encrypted automatically
                  </p>
                  <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                      ≤100MB Free
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      ≤1GB $3
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                      ≤5GB $8
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Transfers Placeholder */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Transfers
                </h2>
                <div className="text-center py-8">
                  <History className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    No transfers yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Your uploaded files will appear here
                  </p>
                  <CustomButton
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setActiveTab('history')}
                  >
                    View Transfer History
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Transfer History
            </h2>
            <div className="text-center py-12">
              <History className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
                No transfers found
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                Upload your first file to see transfer history here
              </p>
              <CustomButton
                variant="primary"
                className="mt-4"
                onClick={() => setActiveTab('overview')}
              >
                Upload First File
              </CustomButton>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Account Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</p>
                      <p className="text-gray-900 dark:text-white">
                        {user?.first_name} {user?.last_name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Joined</p>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(user?.date_joined)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <History className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Login</p>
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(user?.last_login)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-4">
                  <CustomButton variant="outline" size="sm">
                    Edit Profile
                  </CustomButton>
                  <CustomButton 
                    variant="outline" 
                    size="sm"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </CustomButton>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Security & Privacy
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        AES-256 Encryption Enabled
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        All your files are automatically encrypted before upload
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Password Protection Active
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Every file transfer is protected with a unique password
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={handleClosePasswordModal}
      />
    </div>
  );
};

export default Dashboard; 