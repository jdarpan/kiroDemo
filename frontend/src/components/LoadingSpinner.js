import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner component for showing loading states
 * Requirements: 1.2, 7.5, 9.4
 */
const LoadingSpinner = ({ size = 'md', message = 'Loading...', fullScreen = false }) => {
  const spinnerClass = `spinner spinner-${size}`;

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={spinnerClass}></div>
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className={spinnerClass}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
