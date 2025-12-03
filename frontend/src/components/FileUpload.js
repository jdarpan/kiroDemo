import React, { useState } from 'react';
import './FileUpload.css';
import { uploadFile } from '../services/api';
import useAuth from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

/**
 * FileUpload component for uploading dormant account transaction files (Admin only)
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 2.1, 2.2, 2.3
 */
function FileUpload({ onUploadComplete }) {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Check if current user is admin using useAuth hook
  // Requirements: 2.1, 2.2, 2.3
  const { isAdmin } = useAuth();

  // Don't render component if user is not admin
  // Requirements: 2.1, 2.2, 2.3
  if (!isAdmin) {
    return null;
  }

  /**
   * Handle file selection from input
   * Requirements: 7.1
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  /**
   * Validate file selection
   * Requirements: 7.1, 7.5
   */
  const validateAndSetFile = (selectedFile) => {
    setError(null);
    setUploadResult(null);

    if (!selectedFile) {
      return;
    }

    // Validate file type
    if (!selectedFile.name.endsWith('.txt')) {
      const errorMsg = 'Invalid file format. Please select a .txt file.';
      setError(errorMsg);
      // Requirements: 7.5 - Display validation error
      toast.error(errorMsg);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      const errorMsg = 'File size exceeds 10MB limit.';
      setError(errorMsg);
      // Requirements: 7.5 - Display validation error
      toast.error(errorMsg);
      return;
    }

    setFile(selectedFile);
    toast.success('File selected: ' + selectedFile.name);
  };

  /**
   * Handle drag events for drag-and-drop functionality
   * Requirements: 7.1
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * Handle file drop
   * Requirements: 7.1
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  /**
   * Handle file upload
   * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
   */
  const handleUpload = async () => {
    if (!file) {
      const errorMsg = 'Please select a file';
      setError(errorMsg);
      toast.warning(errorMsg);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadResult(null);
    
    // Requirements: 7.5 - Show loading state
    toast.info('Uploading file...');

    try {
      // Simulate progress (since we don't have real progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Call upload API endpoint
      // Requirements: 7.2, 7.3
      const response = await uploadFile(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Display success summary
      // Requirements: 7.4
      setUploadResult({
        success: true,
        totalRecords: response.successCount + response.failureCount,
        successCount: response.successCount,
        failureCount: response.failureCount,
        message: response.message
      });
      
      // Requirements: 7.5 - Display success toast
      toast.success(`File uploaded successfully! ${response.successCount} accounts processed.`);

      // Clear file selection after successful upload
      setFile(null);

      // Refresh dashboard after successful upload
      // Requirements: 7.4
      if (onUploadComplete) {
        setTimeout(() => {
          onUploadComplete();
        }, 1000);
      }
    } catch (err) {
      // Handle upload errors
      // Requirements: 7.5
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload file';
      setError(errorMessage);
      setUploadResult({
        success: false,
        message: errorMessage
      });
      // Requirements: 7.5 - Display error toast
      toast.error('Upload failed: ' + errorMessage);
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  /**
   * Clear selected file
   */
  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setUploadResult(null);
    setUploadProgress(0);
  };

  return (
    <div className="file-upload">
      <div className="upload-header">
        <h3>Upload Dormant Accounts File</h3>
        <span className="admin-badge">Admin Only</span>
      </div>

      <div className="upload-info">
        <p className="format-info">
          <strong>File format:</strong> accountNumber|customerName|bankName|balance|customerEmail
        </p>
        <p className="example-info">
          <strong>Example:</strong> ACC123456|John Doe|Chase Bank|5000.00|john.doe@email.com
        </p>
      </div>

      {/* Drag and drop area - Requirements: 7.1 */}
      <div
        className={`drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="drop-zone-icon">📁</div>
            <p className="drop-zone-text">Drag and drop your file here, or</p>
            <label htmlFor="file-input" className="file-input-label">
              Browse Files
            </label>
            <input
              id="file-input"
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="file-input-hidden"
            />
          </>
        ) : (
          <div className="selected-file">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            {!uploading && (
              <button className="btn-clear" onClick={handleClearFile} title="Remove file">
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload progress - Requirements: 7.1 */}
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p className="progress-text">Uploading... {uploadProgress}%</p>
        </div>
      )}

      {/* Error display - Requirements: 7.5 */}
      {error && (
        <div className="upload-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">{error}</span>
        </div>
      )}

      {/* Upload results - Requirements: 7.4 */}
      {uploadResult && (
        <div className={`upload-result ${uploadResult.success ? 'success' : 'error'}`}>
          <div className="result-header">
            <span className="result-icon">{uploadResult.success ? '✓' : '✗'}</span>
            <span className="result-title">
              {uploadResult.success ? 'Upload Successful' : 'Upload Failed'}
            </span>
          </div>
          {uploadResult.success && (
            <div className="result-details">
              <p><strong>Total Records:</strong> {uploadResult.totalRecords}</p>
              <p><strong>Successfully Added:</strong> {uploadResult.successCount}</p>
              <p><strong>Failed:</strong> {uploadResult.failureCount}</p>
            </div>
          )}
          <p className="result-message">{uploadResult.message}</p>
        </div>
      )}

      {/* Upload button - Requirements: 7.1 */}
      <div className="upload-actions">
        <button
          className="btn-upload"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
}

export default FileUpload;
