// src/pages/Dashboard.jsx
// UPDATED: For ZIP archive approach (ONE link, ONE password)

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import AuthStatus from "../auth/AuthStatus";
import CustomButton from "../forms/CustomButton";
import ChangePasswordModal from "../auth/ChangePasswordModal";
import {
  DragDropArea,
  MultiFilePreview,
  PricingDisplay,
  UploadButton,
} from "../upload";
import UploadProgressModal from "../upload/UploadProgressModal";
import { calculateTotalPricing } from "../../utils/fileUtils";
import {
  Upload,
  History,
  Settings,
  User,
  Shield,
  Clock,
  Copy,
  CheckCircle,
  ExternalLink,
  Trash2,
  Link2,
  Lock,
  AlertCircle,
} from "lucide-react";
import useUploadManager from "../../hooks/useUploadManager";
import {
  getTransferHistory,
  formatFileSize,
  formatDate,
  getTierColors,
  getStatusColors,
} from "../../services/filesAPI";
import PaymentModal from "../payment/PaymentModal";

const Dashboard = () => {
  const { user, getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Upload management - UPDATED for ZIP approach
  const {
    isUploading,
    uploadInfo, // Changed from uploads array
    error,
    progress, // NEW
    currentStatus, // NEW
    startUpload,
    resetUpload,
  } = useUploadManager();

  const [showProgressModal, setShowProgressModal] = useState(false);

  // Transfer history
  const [transferHistory, setTransferHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);

  // Fetch transfer history
  useEffect(() => {
    if (activeTab === "history" || activeTab === "overview") {
      fetchTransferHistory();
    }
  }, [activeTab]);

  // Show progress modal when uploading or upload info is available
  useEffect(() => {
    if (isUploading || uploadInfo) {
      setShowProgressModal(true);
    }
  }, [isUploading, uploadInfo]);

  // Handle payment success redirect
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  
  if (paymentStatus === 'success') {
    // Payment successful - show success message
    alert('Payment successful! You can now upload your files.');
    
    // Clean up URL
    window.history.replaceState({}, '', '/dashboard');
  } else if (paymentStatus === 'canceled') {
    // Payment canceled
    alert('Payment was canceled. Please try again.');
    
    // Clean up URL
    window.history.replaceState({}, '', '/dashboard');
  }
}, []);

  const fetchTransferHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = getAccessToken();
      const data = await getTransferHistory(token);
      setTransferHistory(data);
    } catch (err) {
      console.error("Failed to fetch transfer history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFileSelect = (newFiles) => {
    const newFilesArray = Array.isArray(newFiles) ? newFiles : [newFiles];
    const combinedFiles = [...selectedFiles, ...newFilesArray];

    if (combinedFiles.length > 5) {
      const remainingSlots = 5 - selectedFiles.length;
      if (remainingSlots <= 0) {
        alert(`Maximum 5 files allowed. Please remove some files first.`);
        return;
      }
      alert(
        `Maximum 5 files allowed. Only adding ${remainingSlots} more file(s).`
      );
      setSelectedFiles([
        ...selectedFiles,
        ...newFilesArray.slice(0, remainingSlots),
      ]);
    } else {
      setSelectedFiles(combinedFiles);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]);
  };

  const handleContinue = async (pricing) => {
    // Check if payment is required
    if (pricing.requiresPayment) {
      // Show payment modal instead of alert
      setShowPaymentModal(true);
    } else {
      // Free upload - proceed directly
      try {
        const token = getAccessToken();
        const result = await startUpload(selectedFiles, token);

        if (result.success) {
          setSelectedFiles([]);
        }
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Upload failed: " + err.message);
      }
    }
  };

  const handlePaymentSuccess = async () => {
  // Close payment modal
  setShowPaymentModal(false);
  
  // Proceed with upload
  try {
    const token = getAccessToken();
    const result = await startUpload(selectedFiles, token);
    
    if (result.success) {
      setSelectedFiles([]);
    }
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Upload failed: ' + err.message);
  }
};

  const handleCloseProgressModal = () => {
    setShowProgressModal(false);
    resetUpload();
    fetchTransferHistory();
  };

  const formatDateFull = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Upload },
    { id: "history", label: "Transfer History", icon: History },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const recentTransfers = transferHistory?.recent_uploads?.slice(0, 3) || [];
  const allTransfers = transferHistory?.all_uploads || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

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
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
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

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
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
                      {transferHistory?.statistics?.total_uploads || 0}
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
                      {transferHistory?.statistics?.total_storage_display ||
                        "0 B"}
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
                      Total Downloads
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {transferHistory?.statistics?.total_downloads || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Upload */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Upload
                  {selectedFiles.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({selectedFiles.length}/5{" "}
                      {selectedFiles.length === 1 ? "file" : "files"})
                    </span>
                  )}
                </h2>

                {selectedFiles.length === 0 ? (
                  <DragDropArea
                    onFileSelect={handleFileSelect}
                    multiple={true}
                    maxFiles={5}
                  />
                ) : (
                  <div className="space-y-4">
                    <MultiFilePreview
                      files={selectedFiles}
                      onRemove={handleRemoveFile}
                      onRemoveAll={handleRemoveAllFiles}
                    />

                    <PricingDisplay files={selectedFiles} />

                    {selectedFiles.length < 5 && (
                      <DragDropArea
                        onFileSelect={handleFileSelect}
                        multiple={true}
                        maxFiles={5}
                        addMode={true}
                      />
                    )}

                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <UploadButton
                          files={selectedFiles}
                          onContinue={handleContinue}
                          disabled={isUploading}
                        />
                      </div>
                      <CustomButton
                        variant="outline"
                        onClick={handleRemoveAllFiles}
                        disabled={isUploading}
                      >
                        Cancel
                      </CustomButton>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Transfers */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Transfers
                  </h2>
                  {recentTransfers.length > 0 && (
                    <button
                      onClick={() => setActiveTab("history")}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View All
                    </button>
                  )}
                </div>

                {recentTransfers.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      No transfers yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Your uploaded files will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTransfers.map((transfer) => {
                      const tierColors = getTierColors(transfer.pricing_tier);
                      return (
                        <div
                          key={transfer.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {transfer.original_filename}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(transfer.file_size)} •{" "}
                                {formatDate(transfer.created_at)}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${tierColors.bg} ${tierColors.text}`}
                            >
                              {transfer.pricing_tier}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TRANSFER HISTORY TAB */}
        {activeTab === "history" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                All Transfers ({allTransfers.length})
              </h2>

              {loadingHistory ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Loading transfers...
                  </p>
                </div>
              ) : allTransfers.length === 0 ? (
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
                    onClick={() => setActiveTab("overview")}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Files
                  </CustomButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {allTransfers.map((transfer) => {
                    const tierColors = getTierColors(transfer.pricing_tier);
                    const statusColors = getStatusColors(transfer.status);
                    const downloadLink = `${window.location.origin}/download/${transfer.download_token}`;

                    return (
                      <div
                        key={transfer.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {transfer.original_filename}
                            </h3>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {formatFileSize(transfer.file_size)}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(transfer.created_at)}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {transfer.download_count} downloads
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span
                              className={`text-xs px-2 py-1 rounded ${tierColors.bg} ${tierColors.text}`}
                            >
                              {transfer.pricing_tier}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${statusColors.bg} ${statusColors.text}`}
                            >
                              {transfer.status}
                            </span>
                          </div>
                        </div>

                        {transfer.status === "completed" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            {/* Download Link */}
                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 rounded p-2">
                              <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <input
                                type="text"
                                value={downloadLink}
                                readOnly
                                className="flex-1 text-xs bg-transparent border-0 focus:ring-0 text-gray-700 dark:text-gray-300"
                              />
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    downloadLink,
                                    `link-${transfer.id}`
                                  )
                                }
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                                title="Copy link"
                              >
                                {copiedItem === `link-${transfer.id}` ? (
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                )}
                              </button>
                            </div>

                            {/* Password */}
                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 rounded p-2">
                              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <code className="flex-1 text-xs font-mono text-gray-700 dark:text-gray-300">
                                {transfer.download_password}
                              </code>
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    transfer.download_password,
                                    `pwd-${transfer.id}`
                                  )
                                }
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                                title="Copy password"
                              >
                                {copiedItem === `pwd-${transfer.id}` ? (
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACCOUNT SETTINGS TAB */}
        {activeTab === "settings" && (
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Name
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {user?.first_name} {user?.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Email
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Joined
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {formatDateFull(user?.date_joined)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <History className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Last Login
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {formatDateFull(user?.last_login)}
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
                    onClick={() => setIsChangePasswordModalOpen(true)}
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
                    <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        pricing={selectedFiles.length > 0 ? calculateTotalPricing(selectedFiles) : null}
        files={selectedFiles}
        token={getAccessToken()}
      />

      {/* Upload Progress Modal - UPDATED PROPS */}
      <UploadProgressModal
        isOpen={showProgressModal}
        onClose={handleCloseProgressModal}
        uploadInfo={uploadInfo} // Changed from uploads array
        progress={progress} // NEW
        currentStatus={currentStatus} // NEW
        isUploading={isUploading} // NEW
        error={error} // NEW
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
