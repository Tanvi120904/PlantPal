import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx'; 
import '../Styles/AppHeader.css'; 

const AppHeader = ({ onLoginClick, onSignupClick }) => {
    // CRITICAL: Get isCheckingToken to prevent rendering before state is ready
    const { user, logoutUser, isCheckingToken } = useUser(); 
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

    const handleLogout = () => {
        logoutUser(); 
        navigate('/home'); 
        setIsDropdownOpen(false); 
    };

    const getUsername = (email) => {
        return email ? email.split('@')[0] : 'Guest';
    };

    const username = getUsername(user?.email);

    // --- FIX: Prevent rendering content until the token check is complete ---
    if (isCheckingToken) {
        return (
             <nav className="navbar-home" style={{ justifyContent: 'space-between' }}>
                <div className="navbar-left"><img src="/Main.png" alt="PlantPal Logo" className="logo" /></div>
                <div style={{ padding: '8px 15px' }}>Checking Session...</div>
            </nav>
        );
    }
    // --- END FIX ---

    return (
        <nav className="navbar-home"> 
            <div className="navbar-left">
                <img src="/Main.png" alt="PlantPal Logo" className="logo" />
            </div>
            
            {/* Main Navigation Links */}
            <ul className="nav-links-home">
                <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
                <li><NavLink to="/plantlib" className={({ isActive }) => isActive ? "active" : ""}>Plant Library</NavLink></li>
                <li><NavLink to="/features" className={({ isActive }) => isActive ? "active" : ""}>Features</NavLink></li>
                <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
                <li><NavLink to="/urbangrow" className={({ isActive }) => isActive ? "active" : ""}>UrbanGrow</NavLink></li>
            </ul>

            {/* TOP RIGHT CORNER: Dynamic Authentication Status */}
            <div className="auth-status-container">
                {user ? (
                    // 1. Logged In View: Clickable User Status Dropdown
                    <div className="user-dropdown-wrapper">
                        {/* Dropdown Trigger: Shows Username */}
                        <div 
                            className="user-trigger" 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <img src="/default-avatar.png" alt="User" className="user-avatar" />
                            <span className="username-display">{username}</span>
                        </div>

                        {/* Dropdown Menu Content */}
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {/* Edit Profile is static for now */}
                                <div className="dropdown-item" onClick={() => {navigate('/profile'); setIsDropdownOpen(false);}}>
                                    Edit Profile 
                                </div>
                                <div className="dropdown-item logout-item" onClick={handleLogout}>
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // 2. Logged Out View: Show Login/Signup Buttons
                    <div className="auth-buttons-home">
                        <button className="btn-login-home" onClick={onLoginClick}>Login</button>
                        <button className="btn-signup-home" onClick={onSignupClick}>Signup</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default AppHeader;