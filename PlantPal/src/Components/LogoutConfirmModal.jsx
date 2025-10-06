import React from 'react';
import '../Styles/AuthModal.css'; // We can reuse the same modal styles

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: '1rem', fontSize: '1.8rem' }}>Confirm Logout</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
          Are you sure you want to logout?
        </p>
        <div className="logout-modal-buttons">
          <button className="btn-secondary-logout" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary-logout" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;