import React, { useState } from 'react';
import './FileUpload.css';
import { uploadFile } from '../services/api';

function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadFile(file);
      alert(response.message);
      setFile(null);
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <div className="upload-info">
        <h3>Upload Dormant Accounts</h3>
        <p>File format: accountNumber|holderName|bankName|balance|lastTransactionDate</p>
        <p>Example: ACC123456|John Doe|Chase Bank|5000.00|2020-01-15</p>
      </div>
      
      <div className="upload-controls">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="file-input"
        />
        {file && <span className="file-name">{file.name}</span>}
        <button 
          className="btn-primary"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}

export default FileUpload;
