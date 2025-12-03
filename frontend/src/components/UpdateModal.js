import React, { useState, useEffect } from 'react';
import './UpdateModal.css';
import { useToast } from '../context/ToastContext';

/**
 * UpdateModal component for updating single or multiple dormant accounts
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.2, 6.3, 6.4, 6.5
 */
function UpdateModal({ onClose, onSubmit, accountCount, selectedAccount }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    reclaimStatus: '',
    reclaimDate: '',
    clawbackDate: '',
    comments: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reclaim status options matching backend enum
  const reclaimStatusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' }
  ];

  /**
   * Load current account values if editing a single account
   * Requirements: 5.1
   */
  useEffect(() => {
    if (selectedAccount && accountCount === 1) {
      setFormData({
        reclaimStatus: selectedAccount.reclaimStatus || '',
        reclaimDate: selectedAccount.reclaimDate || '',
        clawbackDate: selectedAccount.clawbackDate || '',
        comments: selectedAccount.comments || ''
      });
    }
  }, [selectedAccount, accountCount]);

  /**
   * Handle form field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   * Requirements: 10.1, 10.2
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate date format (HTML5 date input handles this, but we check for consistency)
    if (formData.reclaimDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.reclaimDate)) {
      newErrors.reclaimDate = 'Invalid date format';
    }

    if (formData.clawbackDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.clawbackDate)) {
      newErrors.clawbackDate = 'Invalid date format';
    }

    // Validate date relationship: clawback date must be after reclaim date
    // Requirements: 10.2
    if (formData.reclaimDate && formData.clawbackDate) {
      const reclaimDate = new Date(formData.reclaimDate);
      const clawbackDate = new Date(formData.clawbackDate);
      
      if (clawbackDate < reclaimDate) {
        newErrors.clawbackDate = 'Clawback date cannot be before reclaim date';
      }
    }

    // Validate comments length
    if (formData.comments && formData.comments.length > 1000) {
      newErrors.comments = 'Comments cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    
    // Requirements: Display validation errors inline
    if (Object.keys(newErrors).length > 0) {
      toast.warning('Please fix the validation errors before submitting');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Requirements: 5.2, 5.3, 5.4, 5.5, 6.2, 6.3, 6.4
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare update data - only include fields that have values
      const updateData = {};
      
      if (formData.reclaimStatus) {
        updateData.reclaimStatus = formData.reclaimStatus;
      }
      
      if (formData.reclaimDate) {
        updateData.reclaimDate = formData.reclaimDate;
      }
      
      if (formData.clawbackDate) {
        updateData.clawbackDate = formData.clawbackDate;
      }
      
      if (formData.comments) {
        updateData.comments = formData.comments;
      }

      await onSubmit(updateData);
    } catch (error) {
      // Error handling is done in parent component
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{accountCount === 1 ? 'Update Account' : `Update ${accountCount} Accounts`}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
        </div>
        
        {/* Display current account values for single account update */}
        {selectedAccount && accountCount === 1 && (
          <div className="current-values">
            <h3>Current Values</h3>
            <div className="current-values-grid">
              <div className="value-item">
                <span className="label">Account Number:</span>
                <span className="value">{selectedAccount.accountNumber}</span>
              </div>
              <div className="value-item">
                <span className="label">Bank Name:</span>
                <span className="value">{selectedAccount.bankName}</span>
              </div>
              <div className="value-item">
                <span className="label">Balance:</span>
                <span className="value">${Number(selectedAccount.balance).toFixed(2)}</span>
              </div>
              <div className="value-item">
                <span className="label">Current Status:</span>
                <span className="value">{selectedAccount.reclaimStatus || 'Not Set'}</span>
              </div>
              <div className="value-item">
                <span className="label">Current Reclaim Date:</span>
                <span className="value">{formatDate(selectedAccount.reclaimDate)}</span>
              </div>
              <div className="value-item">
                <span className="label">Current Clawback Date:</span>
                <span className="value">{formatDate(selectedAccount.clawbackDate)}</span>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reclaimStatus">Reclaim Status</label>
            <select
              id="reclaimStatus"
              name="reclaimStatus"
              value={formData.reclaimStatus}
              onChange={handleChange}
              className={errors.reclaimStatus ? 'error' : ''}
            >
              {reclaimStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.reclaimStatus && (
              <span className="error-message">{errors.reclaimStatus}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reclaimDate">Reclaim Date</label>
            <input
              id="reclaimDate"
              type="date"
              name="reclaimDate"
              value={formData.reclaimDate}
              onChange={handleChange}
              className={errors.reclaimDate ? 'error' : ''}
            />
            {errors.reclaimDate && (
              <span className="error-message">{errors.reclaimDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="clawbackDate">Clawback Date</label>
            <input
              id="clawbackDate"
              type="date"
              name="clawbackDate"
              value={formData.clawbackDate}
              onChange={handleChange}
              className={errors.clawbackDate ? 'error' : ''}
            />
            {errors.clawbackDate && (
              <span className="error-message">{errors.clawbackDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="comments">Comments</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows="4"
              placeholder="Enter comments..."
              maxLength="1000"
              className={errors.comments ? 'error' : ''}
            />
            <div className="character-count">
              {formData.comments.length} / 1000 characters
            </div>
            {errors.comments && (
              <span className="error-message">{errors.comments}</span>
            )}
          </div>

          <div className="modal-footer">
            <div className="button-group">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateModal;
