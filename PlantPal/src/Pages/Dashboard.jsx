import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx'; 
import apiAuth from '../utils/apiAuth'; 
import '../Styles/Dashboard.css'; 

const Dashboard = () => {
    const [devices, setDevices] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // NOTE: We no longer need the 'user' object here for checks, 
    // as AuthWrapper guarantees a user exists.
    
    // --- Simplified Data Fetching ---
    const fetchDevices = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Directly fetch real data. No 'if/else' needed.
            const response = await apiAuth.get('/dashboard/devices'); 
            setDevices(response.data);
        } catch (err) {
            // Handle potential errors like token expiration
             if (err.response && err.response.status === 401) {
                 localStorage.removeItem('userToken'); // Clean up bad token
                 navigate('/'); // Redirect to login
             }
             setError("Failed to fetch your device data.");
             setDevices([]);
        } finally {
            setLoading(false);
        }
    }, [navigate]); // Added navigate as a dependency

    // --- Effect Hook: Runs once on component mount ---
    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]); 


    // --- Interaction & Helpers ---
    const handleWaterNow = async (deviceId) => {
        // No user check needed here. If the user can click this, they are logged in.
        try {
            await apiAuth.post(`/dashboard/water/${deviceId}`);
            alert('Manual watering command sent!');
            fetchDevices(); // Refresh data after watering
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

    // Simplified loading/error states
    if (loading) return <div className="dashboard-loading">Loading Your Dashboard...</div>;
    if (error) return <div className="dashboard-error">Error: {error}</div>;

    return (
        <div className="dashboard-container">
            {/* The AppHeader is now correctly handled by AuthWrapper, so it's removed from here. */}
            
            <header className="dashboard-header-main">
                {/* Title is now static */}
                <h1>Your Live Device Status</h1>
                
                {/* 'Add New Device' button is always shown */}
                <button 
                    className="add-device-btn-header" 
                    onClick={() => navigate('/plantlib')}
                >
                    + Add New Device
                </button>
            </header>
            
            {/* The logged-out banner has been removed. */}

            {devices.length === 0 ? (
                // This view is shown only when a logged-in user has no devices.
                <div className="no-devices-msg-container">
                    <p className="no-devices-msg">You have no devices registered yet. Click "+ Add New Device" to start!</p>
                </div>
            ) : (
                // This grid now ONLY renders real user data.
                <div className="device-cards-grid">
                    {devices.map(device => {
                        const status = getStatus(device.moistureLevel);
                        const isDisabled = device.moistureLevel > 75; 
                        
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
                                    {isDisabled ? 'WATERING DISABLED' : 'WATER NOW'}
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