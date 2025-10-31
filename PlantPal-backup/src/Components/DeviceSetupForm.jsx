// src/Components/DeviceSetupForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Included for standard navigation calls
import apiAuth from '../utils/apiAuth'; // Secure API instance
import { useUser } from '../context/UserContext.jsx';
// src/Components/DeviceSetupForm.jsx


const DeviceSetupForm = ({ onSuccess, onClose }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Your device is automatically connected — no setup needed!");
        
        setTimeout(() => {
            if (onSuccess) onSuccess();
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="device-setup-form" style={{ padding: '20px' }}>
            <h4>Setup Your PlantPal Device</h4>
            <p>Since you’re using a single Arduino device, there’s no need to enter an ID.</p>
            <p>Your sensor data will automatically update on the dashboard.</p>

            <button type="submit" className="login-modal-submit-btn" style={{ marginTop: '20px' }}>
                Continue
            </button>

            {message && (
                <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>
            )}
        </form>
    );
};

export default DeviceSetupForm;
