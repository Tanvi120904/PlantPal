import React from 'react';
import AppHeader from '../Components/AppHeader.jsx'; // Assuming standard header import
import { useNavigate } from 'react-router-dom';

const UrbanGrow = () => {
    const navigate = useNavigate();

    return (
        <div className="urbangrow-container">
            {/* Renders the consistent header */}
            <AppHeader 
                onLoginClick={() => navigate('/home')} 
                onSignupClick={() => navigate('/home')}
            />
            
            <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
                <h1>UrbanGrow Planner (Fancy Service)</h1>
                <p>This page will contain location-based plant suggestions, balcony layout visualization, and seasonal tips.</p>
                <p style={{ color: 'green' }}>Page is loading successfully!</p>
            </div>
        </div>
    );
};

export default UrbanGrow;