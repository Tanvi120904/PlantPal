import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import AppHeader from "./AppHeader.jsx"; // Import the Header to render on all protected pages

const AuthWrapper = () => {
    const { user, isCheckingToken } = useUser();

    // 1. Wait until we know the token status (fixes the lag/flicker)
    if (isCheckingToken) {
        return <div style={{ minHeight: '100vh', textAlign: 'center', paddingTop: '100px' }}>Loading Session...</div>;
    }
    
    // 2. If user is NOT logged in, redirect them back to the login gate (root path)
    if (!user) {
        return <Navigate to="/" replace />; 
    }
    
    // 3. If user IS logged in, render the secured AppHeader and the requested Page content
    return (
        <>
            <AppHeader /> 
            <div style={{ paddingTop: '70px' }}> 
                {/* Outlet renders the specific secure page (Home, Dashboard, etc.) */}
                <Outlet /> 
            </div>
        </>
    );
};

export default AuthWrapper;