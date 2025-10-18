import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import apiAuth from '../utils/apiAuth';
import AppHeader from "../Components/AppHeader.jsx";
import '../Styles/Dashboard.css';
import { FaTrashAlt } from 'react-icons/fa';

// --- MOCK LIGHT REQUIREMENT MAPPING (NEEDED for Pie Chart) ---
const LIGHT_MAPPING = {
    Rose: 'Full Sun',
    Tulip: 'Full Sun',
    Orchid: 'Partial Shade',
    Pothos: 'Partial Shade',
    'Spider Plant': 'Low Light',
    // Add more plant types here...
    Unknown: 'Unknown',
};

// --- Chart Message Component (New) ---
const ChartNoDataMessage = ({ chartType, devicesExist }) => (
    <div className="chart-card chart-no-data">
        <h3>{chartType === 'bar' ? 'Plant Moisture Levels' : 'Light Exposure Distribution'}</h3>
        <div className="no-data-content">
            {devicesExist ? (
                <>
                    <p>Real-time data stream is inactive.</p>
                    <p>Connect your Arduino hardware and backend server to view live monitoring data here.</p>
                </>
            ) : (
                <p>Add a device to see performance charts.</p>
            )}
        </div>
    </div>
);


// --- Moisture Bar Chart Component ---
const MoistureBarChart = ({ data }) => {
    const maxMoisture = 100;

    if (data.length === 0) return <ChartNoDataMessage chartType="bar" devicesExist={false} />;

    // Check if all moisture levels are effectively zero (disconnected state)
    const isDisconnected = data.every(p => (p.moistureLevel || 0) === 0);
    
    if (isDisconnected) return <ChartNoDataMessage chartType="bar" devicesExist={true} />;


    return (
        <div className="chart-card">
            <h3>Plant Moisture Levels</h3>
            <div className="bar-chart-mock">
                {data.map((plant) => {
                    const isLow = plant.moistureLevel < 40;
                    return (
                        <div className="bar-container" key={plant.deviceName}>
                            {/* Highlight the bar tooltip */}
                            {isLow && (
                                <div className="bar-tooltip">
                                    {plant.deviceName} <br /> Moisture (%): {plant.moistureLevel}
                                </div>
                            )}
                            <div
                                className={`bar-fill ${isLow ? "bar-danger" : ""}`}
                                style={{ height: `${(plant.moistureLevel / maxMoisture) * 100}%` }}
                            ></div>
                            <span className="bar-label">{plant.deviceName}</span>
                        </div>
                    );
                })}
            </div>
            <div className="chart-legend">
                <span>■ Moisture (%)</span>
            </div>
        </div>
    );
};

// --- Light Exposure Pie Chart Component ---
const LightPieChart = ({ data }) => {
    if (data.length === 0) return <ChartNoDataMessage chartType="pie" devicesExist={false} />;
    
    // Check if data is meaningful (moisture being 0 is fine, but if we assume "no data" means no plants)
    // If the bar chart is disconnected, this chart should also show the hardware message.
    const isDisconnected = data.every(p => (p.moistureLevel || 0) === 0);
    if (isDisconnected) return <ChartNoDataMessage chartType="pie" devicesExist={true} />;

    // 1. Aggregate counts and assign colors
    const lightCounts = data.reduce((acc, plant) => {
        const light = LIGHT_MAPPING[plant.plantType] || LIGHT_MAPPING.Unknown;
        acc[light] = (acc[light] || { count: 0, names: [], color: '' });
        acc[light].count += 1;
        acc[light].names.push(plant.deviceName);
        
        // Simple color assignment
        if (light === 'Full Sun') acc[light].color = '#F0C808';
        else if (light === 'Partial Shade') acc[light].color = '#4CAF50';
        else if (light === 'Low Light') acc[light].color = '#2196F3';
        else acc[light].color = '#AAAAAA';

        return acc;
    }, {});

    const totalPlants = data.length;
    let currentStart = 0;
    const distribution = Object.keys(lightCounts).map(light => {
        const item = lightCounts[light];
        const percentage = (item.count / totalPlants) * 100;
        const start = currentStart;
        const end = currentStart + percentage;
        currentStart = end;

        return {
            label: light,
            percentage: percentage,
            color: item.color,
            names: item.names,
            start,
            end
        };
    });

    // 2. Mock conic-gradient style
    const createPieStyle = () => {
        let gradient = "conic-gradient(";
        distribution.forEach((item, index) => {
            gradient += `${item.color} ${item.start}% ${item.end}%${
                index < distribution.length - 1 ? ", " : ""
            }`;
        });
        gradient += ")";
        return { background: gradient };
    };

    // 3. Prepare colored labels for display
    const pieLabels = distribution.map((item, index) => (
        <span key={item.label} style={{ color: item.color, fontWeight: 'bold' }}>
            {item.names.join(', ')}
            {index < distribution.length - 1 ? ', ' : ''}
        </span>
    ));

    return (
        <div className="chart-card">
            <h3>Light Exposure Distribution</h3>
            <div className="pie-chart-mock">
                <div className="pie-chart-circle" style={createPieStyle()}></div>
            </div>
            <div className="chart-legend-row">
                {distribution.map((item) => (
                    <div key={item.label} className="legend-item">
                        <span style={{ backgroundColor: item.color }}></span>
                        {item.label}
                    </div>
                ))}
            </div>
            <p className="pie-labels">{pieLabels}</p>
        </div>
    );
};

// --- Delete Feedback Modal Component (No functional changes) ---
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
        onDeleteConfirm(deviceId, finalReason);
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

// --- Dashboard Component ---
const Dashboard = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const navigate = useNavigate();
    
    const { user, isCheckingToken } = useUser();

    // --- Data Fetching (Retained for Initial Data) ---
    const fetchDevices = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        if (user) {
            try {
                // Assuming backend returns an array of devices with { _id, deviceId, deviceName, plantType, moistureLevel, ... }
                // NOTE: moistureLevel should be 0 or null if the hardware isn't connected.
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
            setDevices([]);
        }
        setLoading(false);
    }, [user, navigate]);

    useEffect(() => {
        if (!isCheckingToken) {
            fetchDevices();
        }
    }, [user, isCheckingToken, fetchDevices]);

    // --- LIVE CHART DATA PROCESSING ---
    const chartData = useMemo(() => {
        return devices.map(device => ({
            deviceName: device.deviceName,
            plantType: device.plantType, 
            moistureLevel: device.moistureLevel || 0, // Default to 0 if not provided by backend/socket
        }));
    }, [devices]);

    // --- Deletion Logic (Kept, as requested) ---
    const handleConfirmDeletion = async (deviceId, reason) => {
        try {
            await apiAuth.post('/dashboard/log-feedback', { deviceId, reason });
            await apiAuth.delete(`/dashboard/devices/${deviceId}`);
            
            alert(`Plant deleted. Reason logged: ${reason}`);
            
            setDeviceToDelete(null);
            fetchDevices();
            
        } catch (error) {
            alert("Failed to delete device: " + error.response?.data?.message);
        }
    };

    // Helper functions
    const getStatus = (moisture) => {
        // If data is missing (0), we assume a disconnected/no-reading state
        if (moisture === 0 || moisture === null) return { text: 'NO DATA', className: 'status-nodata' };
        if (moisture <= 25) return { text: 'NEEDS WATER', className: 'status-danger' };
        if (moisture > 75) return { text: 'SATURATED', className: 'status-warning' };
        return { text: 'OPTIMAL', className: 'status-ok' };
    };

    // --- RENDERING BLOCK ---
    if (isCheckingToken) return <div className="dashboard-loading">Checking Session...</div>;
    if (loading) return <div className="dashboard-loading">Loading Device Data...</div>;
    if (error) return <div className="dashboard-error">Error: {error}</div>;

    return (
        <div className="dashboard-container">
            <AppHeader />
            
            <header className="dashboard-header-main">
                <h1>{user ? 'Your Live Device Status' : 'Dashboard Preview'}</h1>
                {user && (
                    <button className="add-device-btn-header" onClick={() => navigate('/plantlib')}>
                        + Add New Device
                    </button>
                )}
            </header>
            
            {/* --- CHARTS SECTION (Always Rendered, shows message if no data) --- */}
            <div className="charts-section">
                <MoistureBarChart data={chartData} />
                <LightPieChart data={chartData} />
            </div>

            {devices.length === 0 && user ? (
                <div className="no-devices-msg-container">
                    <p className="no-devices-msg">You have no devices registered yet. Click "+ Add New Device" to start!</p>
                </div>
            ) : (
                <div className="device-cards-grid">
                    {devices.map(device => {
                        const status = getStatus(device.moistureLevel);
                        
                        return (
                            <div key={device._id} className="device-card-monitor">
                                <div className="card-header-monitor">
                                    <h2 className="device-name">{device.deviceName}</h2>
                                    {/* DELETE ICON BUTTON */}
                                    <button 
                                        className="delete-icon-btn" 
                                        onClick={() => setDeviceToDelete(device)}
                                        title={`Delete ${device.deviceName}`}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                                
                                <p className="plant-type">{device.plantType}</p>
                                <div className="device-id-display">ID: {device.deviceId}</div>

                                <div className="status-indicator-row">
                                    <span className={`device-status ${status.className}`}>
                                        {status.text}
                                    </span>
                                </div>
                                
                                <div className="moisture-circle-wrapper">
                                    <div className="moisture-circle" style={{ '--value': device.moistureLevel || 0 }}>
                                        <span className="moisture-percent">
                                            {device.moistureLevel === 0 || device.moistureLevel === null ? '--' : `${device.moistureLevel}%`}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* REMOVED WATER NOW BUTTON AS REQUESTED */}
                                <div className="no-manual-control-message">
                                    Automatic Control Only
                                </div>
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