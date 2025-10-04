import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx'; 
import apiAuth from '../utils/apiAuth'; 
import AppHeader from "../Components/AppHeader.jsx"; 
import '../Styles/Dashboard.css'; 

// --- STATIC SAMPLE DATA (Shown when logged out) ---
const samplePreviewDevices = [
    { 
        _id: 'sample1', 
        deviceName: 'Monstera Deliciosa', 
        plantType: 'Foliage', 
        moistureLevel: 35, 
        updatedAt: Date.now() 
    },
    { 
        _id: 'sample2', 
        deviceName: 'Snake Plant (Desk)', 
        plantType: 'Hardy', 
        moistureLevel: 65, 
        updatedAt: Date.now() 
    }
];


const Dashboard = () => {
    const [devices, setDevices] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const { user, isCheckingToken } = useUser(); 

    // --- Data Fetching: Handles conditional data source ---
    const fetchDevices = async () => {
        setLoading(true);
        setError(null);
        
        if (user) {
            // LOGGED IN: Fetch real data securely
            try {
                const response = await apiAuth.get('/dashboard/devices'); 
                setDevices(response.data);
            } catch (err) {
                 if (err.response && err.response.status === 401) {
                     localStorage.removeItem('userToken');
                     navigate('/home'); 
                 }
                 setError("Failed to fetch user data.");
                 setDevices([]);
            }
        } else {
            // LOGGED OUT: Load static preview data
            setDevices(samplePreviewDevices);
        }
        setLoading(false);
    };

    // --- Effect Hook: Runs immediately when user status changes (Fixes the refresh lag) ---
    useEffect(() => {
        // Only run fetch after the initial token check is complete
        if (!isCheckingToken) {
            fetchDevices();
        }
    }, [user, isCheckingToken, navigate]); 


    // --- Interaction & Helpers ---
    const handleWaterNow = async (deviceId) => {
        if (!user) {
            alert("Please log in to control your devices.");
            return;
        }
        try {
            await apiAuth.post(`/dashboard/water/${deviceId}`);
            alert('Manual watering command sent!');
            fetchDevices(); 
        } catch (error) {
            alert('Failed to send water command.');
        }
    };

    const getStatus = (moisture) => {
        if (moisture <= 25) return { text: 'NEEDS WATER', className: 'status-danger' };
        if (moisture > 75) return { text: 'SATURATED', className: 'status-warning' };
        return { text: 'OPTIMAL', className: 'status-ok' };
    };

    // --- RENDERING BLOCK ---

    if (isCheckingToken) return <div className="dashboard-loading">Checking Session...</div>;
    if (loading) return <div className="dashboard-loading">Loading Dashboard...</div>;
    if (error) return <div className="dashboard-error">Error: {error}</div>;

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh' }}>
            <AppHeader onLoginClick={() => navigate('/home')} onSignupClick={() => navigate('/home')} />
            
            <header className="dashboard-header-main">
                {/* Title changes based on login status */}
                <h1>{user ? 'Your Live Device Status' : 'Dashboard Preview'}</h1>
                
                {/* 'Add New Device' button only appears when logged in */}
                {user && ( 
                    <button 
                        className="add-device-btn-header" 
                        onClick={() => navigate('/plantlib')}
                    >
                        + Add New Device
                    </button>
                )}
            </header>
            
            {/* Logged Out Message/Call to Action (Shown only when logged out) */}
            {!user && (
                <div className="call-to-action-banner">
                    <h2>🌱 Register Now to Create Your Garden!</h2>
                    <p>Log in or sign up to connect your devices and get personalized live monitoring data.</p>
                </div>
            )}


            {devices.length === 0 && user ? (
                // Logged In, but no devices registered yet
                <div className="no-devices-msg-container">
                    <p className="no-devices-msg">You have no devices registered yet. Click "+ Add New Device" to start!</p>
                </div>
            ) : (
                // Renders cards for either live user data OR the static sample data
                <div className="device-cards-grid">
                    {devices.map(device => {
                        const status = getStatus(device.moistureLevel);
                        const isDisabled = device.moistureLevel > 75 || !user; 
                        
                        return (
                            <div key={device._id} className="device-card-monitor">
                                <div className="card-header-monitor">
                                    <h2 className="device-name">{device.deviceName}</h2>
                                    <p className="plant-type">{device.plantType}</p>
                                </div>
                                
                                <div className="status-indicator-row">
                                    <span className={`device-status ${status.className}`}>
                                        {status.text}
                                    </span>
                                </div>
                                
                                {/* Moisture Gauge */}
                                <div className="moisture-circle-wrapper">
                                    <div 
                                        className="moisture-circle" 
                                        style={{ '--value': device.moistureLevel }}
                                    >
                                        <span className="moisture-percent">{device.moistureLevel}%</span>
                                    </div>
                                </div>
                                
                                <button 
                                    className="water-now-btn" 
                                    onClick={() => handleWaterNow(device._id)}
                                    disabled={isDisabled}
                                >
                                    {isDisabled ? 'DISABLED' : 'WATER NOW'}
                                </button>

                                <p className="last-check-time">
                                    Last Data: {new Date(device.updatedAt || device.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Dashboard;