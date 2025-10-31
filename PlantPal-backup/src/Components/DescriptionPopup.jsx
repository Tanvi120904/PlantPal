// src/components/DescriptionPopup.jsx
import React from "react";

export default function DescriptionPopup({ visible, onClose }) {
  if (!visible) return null;

  return (
    <>
      <div className="popup-overlay">
        <div className="popup-content">
          <img src="/water-sensor.png" alt="Sensor Setup Guide" className="popup-img" />
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {/* Inline CSS so no separate file needed */}
      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
          max-width: 90%;
          max-height: 90%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          text-align: center;
          overflow-y: auto;
        }

        .popup-content h2 {
          margin-top: 0;
          font-size: 1.3rem;
          color: #0d5d10;
        }

        .popup-img {
          width: 100%;
          height: auto;
          margin-top: 10px;
          border-radius: 8px;
        }

        .close-btn {
          background: #0d5d10;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
          font-size: 0.95rem;
        }

        .close-btn:hover {
          background: #45a049;
        }
      `}</style>
    </>
  );
}
