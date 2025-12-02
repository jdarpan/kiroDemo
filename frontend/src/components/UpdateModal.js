import React, { useState } from 'react';
import './UpdateModal.css';

function UpdateModal({ onClose, onSubmit, accountCount }) {
  const [formData, setFormData] = useState({
    reclaimFlag: false,
    reclaimDate: '',
    clawbackDate: '',
    comments: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = {
      reclaimFlag: formData.reclaimFlag,
      reclaimDate: formData.reclaimDate || null,
      clawbackDate: formData.clawbackDate || null,
      comments: formData.comments || null
    };
    onSubmit(updateData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Accounts</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="reclaimFlag"
                checked={formData.reclaimFlag}
                onChange={handleChange}
              />
              Reclaim Flag
            </label>
          </div>

          <div className="form-group">
            <label>Reclaim Date</label>
            <input
              type="date"
              name="reclaimDate"
              value={formData.reclaimDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Clawback Date</label>
            <input
              type="date"
              name="clawbackDate"
              value={formData.clawbackDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows="4"
              placeholder="Enter comments..."
            />
          </div>

          <div className="modal-footer">
            <p className="account-count">Updating {accountCount} account(s)</p>
            <div className="button-group">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateModal;
