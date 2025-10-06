import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import LogoutConfirmModal from './LogoutConfirmModal.jsx'; // 1. IMPORT the new modal
import '../Styles/AppHeader.css';

const AppHeader = () => {
    const { user, logoutUser, isCheckingToken } = useUser();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // 2. ADD state for the modal

    // 3. This function will be called when the user confirms the logout
    const handleLogoutConfirm = () => {
        logoutUser();
        navigate('/'); // Redirect to the initial page
        setIsLogoutModalOpen(false);
    };

    if (isCheckingToken || !user) {
        return null;
    }

    return (
        <>
            <nav className="navbar-home">
                <div className="navbar-left">
                    <img src="/Main.png" alt="PlantPal Logo" className="logo" />
                </div>
                
                <ul className="nav-links-home">
                    <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
                    <li><NavLink to="/plantlib" className={({ isActive }) => isActive ? "active" : ""}>Plant Library</NavLink></li>
                    <li><NavLink to="/features" className={({ isActive }) => isActive ? "active" : ""}>Features</NavLink></li>
                    <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
                    <li><NavLink to="/urbangrow" className={({ isActive }) => isActive ? "active" : ""}>UrbanGrow</NavLink></li>
                </ul>

                {/* --- MODIFIED: Replaced dropdown with a direct Logout button --- */}
                <div className="auth-buttons-container">
                    <button className="btn-logout" onClick={() => setIsLogoutModalOpen(true)}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* 4. ADD the modal component here */}
            <LogoutConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </>
    );
};

export default AppHeader;