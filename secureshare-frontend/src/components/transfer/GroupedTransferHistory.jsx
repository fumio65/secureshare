// src/components/transfer/GroupedTransferHistory.jsx
// Component for displaying grouped batch uploads

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, CheckCircle, Link2, Lock, Files, Calendar, Download } from 'lucide-react';
import { formatFileSize, formatDate, getTierColors, getStatusColors } from '../../services/filesAPI';
import CustomButton from '../forms/CustomButton';

/**
 * GroupedTransferHistory Component
 * Displays file uploads grouped by batch with expand/collapse functionality
 */
const GroupedTransferHistory = ({ groupedBatches, onCopyLink, onCopyPassword, copiedItem }) => {
  const [expandedBatches, setExpandedBatches] = useState(new Set());

  const toggleBatch = (batchId) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batchId)) {
      newExpanded.delete(batchId);
    } else {
      newExpanded.add(batchId);
    }
    setExpandedBatches(newExpanded);
  };

  const copyAllLinks = (batch) => {
    const links = batch.files
      .map(file => `${window.location.origin}/download/${file.download_token}`)
      .join('\n');
    
    navigator.clipboard.writeText(links).then(() => {
      alert(`Copied ${batch.file_count} download links!`);
    });
  };

  const copyAllPasswords = (batch) => {
    const passwords = batch.files
      .map((file, index) => `${file.original_filename}: ${file.download_password}`)
      .join('\n');
    
    navigator.clipboard.writeText(passwords).then(() => {
      alert(`Copied ${batch.file_count} passwords!`);
    });
  };

  if (!groupedBatches || groupedBatches.length === 0) {
    return (
      <div className="text-center py-12">
        <Files className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
          No transfers found
        </p>
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          Upload your first file to see transfer history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedBatches.map((batch) => {
        const isExpanded = expandedBatches.has(batch.batch_id);
        const tierColors = getTierColors(batch.pricing_tier);
        const isBatch = batch.is_batch_upload && batch.file_count > 1;

        return (
          <div
            key={batch.batch_id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Batch Header */}
            <div
              className="bg-white dark:bg-gray-800 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => toggleBatch(batch.batch_id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Expand/Collapse Icon */}
                  {isBatch && (
                    <button className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  )}

                  {/* Batch Icon */}
                  <div className={`p-2 rounded-lg ${tierColors.bg} mt-1`}>
                    <Files className={`w-5 h-5 ${tierColors.text}`} />
                  </div>

                  {/* Batch Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {isBatch ? (
                        `Batch Upload - ${batch.file_count} files`
                      ) : (
                        batch.files[0]?.original_filename || 'Upload'
                      )}
                    </h3>
                    <div className="flex items-center flex-wrap gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(batch.created_at)}
                      </span>
                      <span>•</span>
                      <span>{batch.total_size_display}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Download className="w-3.5 h-3.5 mr-1" />
                        {batch.total_downloads} downloads
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tier Badge */}
                <span className={`text-xs px-2 py-1 rounded ${tierColors.bg} ${tierColors.text} ml-4`}>
                  {batch.pricing_tier}
                </span>
              </div>

              {/* Batch Actions (only show if batch and expanded) */}
              {isBatch && isExpanded && (
                <div className="flex space-x-2 mt-3">
                  <CustomButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyAllLinks(batch);
                    }}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy All Links
                  </CustomButton>
                  <CustomButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyAllPasswords(batch);
                    }}
                  >
                    <Lock className="w-3.5 h-3.5 mr-1" />
                    Copy All Passwords
                  </CustomButton>
                </div>
              )}
            </div>

            {/* Expanded File List or Single File */}
            {(isExpanded || !isBatch) && (
              <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {batch.files.map((file, index) => {
                    const downloadLink = `${window.location.origin}/download/${file.download_token}`;
                    const statusColors = getStatusColors(file.status);

                    return (
                      <div key={file.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              {isBatch && (
                                <span className="text-xs font-mono text-gray-400">
                                  #{index + 1}
                                </span>
                              )}
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {file.original_filename}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatFileSize(file.file_size)} • {file.download_count} downloads
                            </p>
                          </div>
                          {file.status === 'completed' && (
                            <span className={`text-xs px-2 py-1 rounded ${statusColors.bg} ${statusColors.text} ml-2`}>
                              {file.status}
                            </span>
                          )}
                        </div>

                        {file.status === 'completed' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                            {/* Download Link */}
                            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
                              <Link2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <input
                                type="text"
                                value={downloadLink}
                                readOnly
                                className="flex-1 text-xs bg-transparent border-0 focus:ring-0 text-gray-700 dark:text-gray-300"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCopyLink(downloadLink, `link-${file.id}`);
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                                title="Copy link"
                              >
                                {copiedItem === `link-${file.id}` ? (
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                )}
                              </button>
                            </div>

                            {/* Password */}
                            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
                              <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <code className="flex-1 text-xs font-mono text-gray-700 dark:text-gray-300">
                                {file.download_password}
                              </code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCopyPassword(file.download_password, `pwd-${file.id}`);
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                                title="Copy password"
                              >
                                {copiedItem === `pwd-${file.id}` ? (
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupedTransferHistory;