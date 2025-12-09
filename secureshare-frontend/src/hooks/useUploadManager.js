// src/hooks/useUploadManager.js
// UPDATED: For ZIP archive approach (ONE link, ONE password)

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing file uploads with ZIP archive approach
 * Multiple files (2+) = ONE ZIP file with ONE link and ONE password
 * Single file = Normal upload with ONE link and ONE password
 */
const useUploadManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');

  /**
   * Main upload function - Creates ZIP for 2+ files, normal upload for 1 file
   */
  const startUpload = useCallback(async (files, authToken) => {
    setIsUploading(true);
    setError(null);
    setProgress(0);
    setUploadInfo(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      
      // Step 1: Prepare file data
      setCurrentStatus('Preparing files...');
      setProgress(10);

      const filesData = files.map(file => ({
        filename: file.name,
        file_size: file.size,
        mime_type: file.type || 'application/octet-stream'
      }));

      // Step 2: Create upload entries first
      setCurrentStatus('Creating upload entries...');
      setProgress(15);

      const createResponse = await fetch(`${apiUrl}/files/bulk/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ files: filesData })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Failed to create upload entries');
      }

      const createData = await createResponse.json();
      console.log('Created upload entry:', createData);
      
      // Backend returns single upload object, not array
      const uploadId = createData.upload?.id;
      if (!uploadId) {
        throw new Error('No upload ID received from server. Response: ' + JSON.stringify(createData));
      }
      
      console.log('Upload ID:', uploadId);
      setProgress(25);

      // Step 3: Upload files content
      setCurrentStatus(files.length > 1 ? 'Creating ZIP archive...' : 'Uploading file...');
      setProgress(30);

      const formData = new FormData();
      
      // Backend expects single 'upload_id' (not 'upload_ids')
      formData.append('upload_id', uploadId);
      
      // Add files with indexed keys (file_0, file_1, etc.)
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const uploadProgress = 30 + ((e.loaded / e.total) * 60);
            setProgress(uploadProgress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error('Invalid response from server'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.error || errorData.detail || xhr.statusText));
            } catch (e) {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.open('POST', `${apiUrl}/files/bulk/upload/`);
        xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        xhr.send(formData);
      });

      const uploadData = await uploadPromise;
      console.log('Upload response:', uploadData);
      setProgress(90);

      // Step 4: Finalize and set upload info
      setCurrentStatus('Finalizing...');
      
      // Use data from upload response
      const uploadInfo = uploadData.upload || uploadData;
      
      const finalUploadInfo = {
        id: uploadInfo.id,
        filename: uploadInfo.original_filename || uploadInfo.filename,
        files: createData.contained_files ? createData.contained_files.map((name, idx) => ({
          filename: name,
          file_size: filesData[idx]?.file_size || 0
        })) : filesData,
        isZip: createData.is_zip || files.length > 1,
        fileCount: createData.total_files || files.length,
        totalSize: createData.total_size || files.reduce((sum, file) => sum + file.size, 0),
        password: uploadInfo.download_password,
        downloadLink: `${window.location.origin}/download/${uploadInfo.download_token}`,
        downloadToken: uploadInfo.download_token,
        status: 'completed',
        uploadedAt: new Date().toISOString()
      };

      setUploadInfo(finalUploadInfo);
      setProgress(100);
      setCurrentStatus('Complete!');

      return { success: true, uploadInfo: finalUploadInfo };

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      setCurrentStatus('Error');
      
      return { success: false, error: err.message };
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Reset upload state
   */
  const resetUpload = useCallback(() => {
    setUploadInfo(null);
    setError(null);
    setIsUploading(false);
    setProgress(0);
    setCurrentStatus('');
  }, []);

  return {
    isUploading,
    uploadInfo,
    error,
    progress,
    currentStatus,
    startUpload,
    resetUpload
  };
};

export default useUploadManager;