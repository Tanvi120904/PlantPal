import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx'; 
import apiAuth from '../utils/apiAuth'; 
import AppHeader from "../Components/AppHeader.jsx"; 
import '../Styles/Dashboard.css'; 
import { FaTrashAlt } from 'react-icons/fa'; // IMPORT DELETE ICON
import { BsWater, BsFillStopFill } from 'react-icons/bs'; // IMPORT WATER/STOP ICONS

// --- Delete Feedback Modal Component ---
const DeleteFeedbackModal = ({ deviceName, deviceId, onClose, onDeleteConfirm }) => {
    const [reason, setReason] = useState('died-device-issue');
    const [otherReason, setOtherReason] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteReasons = [
        { value: 'died-device-issue', label: 'Plant died (Device malfunction)' },
        { value: 'died-no-care', label: 'Plant died (Lack of proper care)' },
        { value: 'died-environment', label: 'Plant died (Environmental issues)' },
        { value: 'pests', label: 'Pest/Disease issue' },
        { value: 'other', label: 'Other (Please specify)' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalReason = reason === 'other' ? otherReason : reason;
        
        if (!finalReason) {
            alert("Please provide a reason for deletion.");
            return;
        }

        setIsDeleting(true);
        // Pass the final action and data up to the Dashboard component
        onDeleteConfirm(deviceId, finalReason);
        // Modal closes in the Dashboard's deletion handler
    };

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="delete-modal-close-btn" onClick={onClose}>&times;</button>
                <h3>Delete "{deviceName}"</h3>
                <p>Please help us improve by telling us why you are removing this plant:</p>
                
                <form onSubmit={handleSubmit}>
                    <select value={reason} onChange={(e) => setReason(e.target.value)} className="reason-select">
                        {deleteReasons.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>

                    {reason === 'other' && (
                        <textarea
                            placeholder="Specify the reason here..."
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            className="other-reason-text"
                            required
                        />
                    )}

                    <button type="submit" className="delete-confirm-btn" disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete Device'}
                    </button>
                </form>
            </div>
        </div>
    );
};


const Dashboard = () => {
    const [devices, setDevices] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deviceToDelete, setDeviceToDelete] = useState(null); // NEW: State for deletion modal
    const navigate = useNavigate();
    
    const { user, isCheckingToken } = useUser(); 

    // --- Data Fetching (Use Case: After Login, After Deletion) ---
    const fetchDevices = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        if (user) {
            try {
                const response = await apiAuth.get('/dashboard/devices'); 
                setDevices(response.data);
            } catch (err) {
                 if (err.response && err.response.status === 401) {
                     localStorage.removeItem('userToken');
                     navigate('/'); 
                 }
                 setError("Failed to fetch user data.");
                 setDevices([]);
            }
        } else {
            // Logged Out: Load static preview data
            // NOTE: Add samplePreviewDevices array definition or import here if you use it
            setDevices([]); 
        }
        setLoading(false);
    }, [user, navigate]);

    useEffect(() => {
        if (!isCheckingToken) {
            fetchDevices();
        }
    }, [user, isCheckingToken, fetchDevices]); 

    // --- INTERACTION HANDLERS ---
    
    const handleWaterNow = async (deviceId, isWatering) => {
        const endpoint = isWatering ? `/dashboard/water/${deviceId}` : `/dashboard/stop-water/${deviceId}`; // Assume stop-water endpoint exists
        
        try {
            await apiAuth.post(endpoint);
            alert(isWatering ? 'Watering started!' : 'Watering stopped!');
            fetchDevices(); // Refresh data after action
        } catch (error) {
            alert('Failed to send command.');
        }
    };
    
    // Deletion Logic
    const handleConfirmDeletion = async (deviceId, reason) => {
        try {
            // 1. Log Feedback (Assume a POST endpoint for logging feedback exists)
            await apiAuth.post('/dashboard/log-feedback', { deviceId, reason });
            
            // 2. Delete Device from main DB
            await apiAuth.delete(`/dashboard/devices/${deviceId}`);
            
            alert(`Plant deleted. Reason logged: ${reason}`);
            
            // 3. Close modal and refresh list
            setDeviceToDelete(null); 
            fetchDevices(); 
            
        } catch (error) {
            alert("Failed to delete device: " + error.response?.data?.message);
        }
    };

    // Helper functions (getStatus remains the same)
    const getStatus = (moisture) => {
        if (moisture <= 25) return { text: 'NEEDS WATER', className: 'status-danger' };
        if (moisture > 75) return { text: 'SATURATED', className: 'status-warning' };
        return { text: 'OPTIMAL', className: 'status-ok' };
    };

    // --- RENDERING BLOCK ---
    if (isCheckingToken) return <div className="dashboard-loading">Checking Session...</div>;
    if (loading) return <div className="dashboard-loading">Loading Device Data...</div>;
    if (error) return <div className="dashboard-error">Error: {error}</div>;


    return (
        <div className="dashboard-container" style={{ minHeight: '100vh' }}>
            <AppHeader />
            
            <header className="dashboard-header-main">
                <h1>{user ? 'Your Live Device Status' : 'Dashboard Preview'}</h1>
                {user && ( 
                    <button className="add-device-btn-header" onClick={() => navigate('/plantlib')}>
                        + Add New Device
                    </button>
                )}
            </header>
            
            {/* ... Conditional rendering of devices and empty state ... */}

            {devices.length === 0 && user ? (
                // Logged In, but no devices registered yet
                <div className="no-devices-msg-container">
                    <p className="no-devices-msg">You have no devices registered yet. Click "+ Add New Device" to start!</p>
                </div>
            ) : (
                <div className="device-cards-grid">
                    {devices.map(device => {
                        const status = getStatus(device.moistureLevel);
                        const isWatering = false; // Placeholder: Assume a status check from DB
                        const isDisabled = device.moistureLevel > 75; 
                        
                        return (
                            <div key={device._id} className="device-card-monitor">
                                <div className="card-header-monitor">
                                    <h2 className="device-name">{device.deviceName}</h2>
                                    <p className="plant-type">{device.plantType}</p>
                                    
                                    {/* DELETE ICON BUTTON */}
                                    <button 
                                        className="delete-icon-btn" 
                                        onClick={() => setDeviceToDelete(device)}
                                        title={`Delete ${device.deviceName}`}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>

                                <div className="device-id-display">ID: {device.deviceId}</div>  {/* NEW: Display Device ID */}

                                
                                
                                {/* ... (Status, Gauge, etc.) ... */}
                                
                                <div className="status-indicator-row">
                                    <span className={`device-status ${status.className}`}>
                                        {status.text}
                                    </span>
                                </div>
                                
                                <div className="moisture-circle-wrapper">
                                    <div className="moisture-circle" style={{ '--value': device.moistureLevel }}><span className="moisture-percent">{device.moistureLevel}%</span></div>
                                </div>
                                
                                <button 
                                    className={`water-now-btn ${isWatering ? 'stop-btn' : ''}`} 
                                    onClick={() => handleWaterNow(device._id, !isWatering)}
                                    disabled={isDisabled}
                                >
                                    {isWatering ? (
                                        <><BsFillStopFill style={{ marginRight: '5px' }} /> STOP</>
                                    ) : (
                                        <><BsWater style={{ marginRight: '5px' }} /> WATER NOW</>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- DELETE FEEDBACK MODAL RENDERING --- */}
            {deviceToDelete && (
                <DeleteFeedbackModal 
                    deviceName={deviceToDelete.deviceName}
                    deviceId={deviceToDelete._id}
                    onClose={() => setDeviceToDelete(null)}
                    onDeleteConfirm={handleConfirmDeletion}
                />
            )}
        </div>
    );
};

export default Dashboard;