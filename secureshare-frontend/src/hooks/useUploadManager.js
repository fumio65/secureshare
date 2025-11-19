// FILE: src/hooks/useUploadManager.js
// Fixed version with better state management

import { useState, useCallback, useEffect } from 'react';
import { formatFileSize } from '../utils/fileUtils';

export const useUploadManager = () => {
  const [uploads, setUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const startUpload = useCallback((files) => {
    console.log('🚀 startUpload called with files:', files);
    
    if (!files || files.length === 0) {
      console.error('❌ No files provided to startUpload');
      return;
    }

    // Create initial upload objects
    const initialUploads = files.map(file => ({
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      progress: 0,
      status: 'uploading',
      file: file,
      timeRemaining: 'Calculating...'
    }));

    console.log('📊 Initial uploads created:', initialUploads);

    // Set state in correct order
    setUploads(initialUploads);
    setOverallProgress(0);
    setIsUploading(true);
    
    // Small delay to ensure state is set before showing modal
    setTimeout(() => {
      setShowProgressModal(true);
      console.log('✅ Progress modal opened');
      
      // Start simulating upload for each file
      initialUploads.forEach((_, index) => {
        simulateUpload(index, files);
      });
    }, 100);
  }, []);

  const simulateUpload = (index, files) => {
    console.log(`⏳ Starting simulation for file ${index + 1}`);
    
    let progress = 0;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      // Random progress increment (simulating network speed variation)
      progress += Math.random() * 15;
      
      // Calculate estimated time remaining
      const elapsed = Date.now() - startTime;
      const rate = progress / elapsed;
      const remaining = ((100 - progress) / rate) / 1000;
      const timeRemaining = remaining > 60 
        ? `${Math.ceil(remaining / 60)} min` 
        : `${Math.ceil(remaining)} sec`;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        console.log(`✅ File ${index + 1} upload complete`);
        updateUploadStatus(index, 'success', 100);
      } else {
        updateUploadProgress(index, Math.floor(progress), timeRemaining);
      }
    }, 300); // Update every 300ms for smooth animation
  };

  const updateUploadProgress = useCallback((index, progress, timeRemaining = null) => {
    setUploads(prev => prev.map((upload, i) => 
      i === index 
        ? { ...upload, progress, ...(timeRemaining && { timeRemaining }) }
        : upload
    ));
  }, []);

  const updateUploadStatus = useCallback((index, status, progress = null) => {
    setUploads(prev => {
      const updated = prev.map((upload, i) => 
        i === index 
          ? { 
              ...upload, 
              status, 
              ...(progress !== null && { progress }),
              ...(status === 'success' && { timeRemaining: null })
            }
          : upload
      );

      // Check if all uploads are complete
      const allComplete = updated.every(u => u.status === 'success' || u.status === 'error');
      if (allComplete) {
        console.log('🎉 All uploads complete!');
        setIsUploading(false);
      }

      return updated;
    });
  }, []);

  const resetUploads = useCallback(() => {
    console.log('🔄 Resetting uploads');
    setUploads([]);
    setIsUploading(false);
    setShowProgressModal(false);
    setOverallProgress(0);
  }, []);

  const closeProgressModal = useCallback(() => {
    console.log('❌ Closing progress modal');
    setShowProgressModal(false);
  }, []);

  // Calculate overall progress whenever uploads change
  useEffect(() => {
    if (uploads.length > 0) {
      const total = uploads.reduce((sum, u) => sum + u.progress, 0);
      const average = Math.floor(total / uploads.length);
      setOverallProgress(average);
    }
  }, [uploads]);

  // Check if modal can be closed (all files complete or have errors)
  const canCloseModal = uploads.length > 0 && uploads.every(
    u => u.status === 'success' || u.status === 'error'
  );

  // Debug logging
  useEffect(() => {
    console.log('📊 Upload Manager State:', {
      uploads: uploads.length,
      isUploading,
      showProgressModal,
      overallProgress,
      canCloseModal
    });
  }, [uploads, isUploading, showProgressModal, overallProgress, canCloseModal]);

  return {
    uploads,
    isUploading,
    overallProgress,
    showProgressModal,
    canCloseModal,
    startUpload,
    resetUploads,
    closeProgressModal
  };
};