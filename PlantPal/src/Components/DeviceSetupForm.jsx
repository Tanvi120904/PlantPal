// src/Components/DeviceSetupForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Included for standard navigation calls
import apiAuth from '../utils/apiAuth'; // Secure API instance
import { useUser } from '../context/UserContext.jsx';
// Props: plantId, plantName, onSuccess (handler for successful setup/redirect), onClose
const DeviceSetupForm = ({ plantId, plantName, onSuccess, onClose }) => {
    const [deviceName, setDeviceName] = useState(plantName);
    const [deviceId, setDeviceId] = useState(''); // Unique ID from Arduino setup
    const [message, setMessage] = useState('');
    
    // We don't use the useNavigate hook directly here, but onSuccess handles it

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!deviceId || !deviceName) {
            setMessage("Device Name and ID are required.");
            return;
        }

        try {
            // POST request to the protected backend route: /api/dashboard/setup-device
            await apiAuth.post('/dashboard/setup-device', {
                plantId: plantId, // MongoDB ID of the selected plant
                deviceName: deviceName,
                deviceId: deviceId // Unique ID for hardware
            });

            setMessage(`Success! Device ${deviceName} is registered.`);
            
            // CRITICAL: Call the success handler passed from the Plantlib component
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(); // This closes the modal AND navigates to the dashboard
                }
            }, 1000); 

        } catch (error) {
            const msg = error.response?.data?.message || "Setup failed. Check your Device ID and server logs.";
            setMessage(msg);
            console.error("Device Setup Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="device-setup-form" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Setup: {plantName}</h4>
            <p>1. Name your device:</p>
            <input 
                type="text" 
                value={deviceName} 
                onChange={(e) => setDeviceName(e.target.value)} 
                required 
            />
            <p>2. Enter Device ID (from Arduino/IoT setup):</p>
            <input 
                type="text" 
                value={deviceId} 
                onChange={(e) => setDeviceId(e.target.value)} 
                placeholder="E.g., ARD-001"
                required 
            />
            
            <button type="submit" className="login-modal-submit-btn" style={{ marginTop: '20px' }}>Register Device</button>
            {message && <p style={{ color: message.includes('Success') ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
        </form>
    );
};

export default DeviceSetupForm;