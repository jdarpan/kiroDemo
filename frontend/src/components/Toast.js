import React, { useEffect, useState } from 'react';
import './Toast.css';

/**
 * Toast notification component
 * Requirements: 1.2, 7.5, 9.4
 */
const Toast = ({ id, message, type, duration, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      // Start exit animation slightly before removal
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, duration - 300);

      return () => clearTimeout(exitTimer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose} aria-label="Close notification">
        ✕
      </button>
    </div>
  );
};

export default Toast;
