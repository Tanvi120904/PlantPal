import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import LogoutConfirmModal from './LogoutConfirmModal.jsx';
import { FaUserCircle } from 'react-icons/fa';
import '../Styles/AppHeader.css';

const AppHeader = () => {
  const { user, logoutUser, isCheckingToken } = useUser();
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [displayName, setDisplayName] = useState('User');

  // ✅ Load name from context or localStorage (for refresh persistence)
  useEffect(() => {
    if (user?.name) {
      setDisplayName(user.name.split(' ')[0]);
    } else {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setDisplayName(parsedUser.name?.split(' ')[0] || 'User');
      }
    }
  }, [user]);

  const handleLogoutConfirm = () => {
    logoutUser();
    navigate('/');
    setIsLogoutModalOpen(false);
  };

  const handleEditProfile = () => {
    setIsProfileDropdownOpen(false);
    navigate('/profile');
  };

  if (isCheckingToken || !user) return null;

  return (
    <>
      <nav className="navbar-home">
        {/* --- Left Section (Logo) --- */}
        <div className="navbar-left">
          <img src="/Main.png" alt="PlantPal Logo" className="logo" />
        </div>

        {/* --- Center Navigation Links --- */}
        <ul className="nav-links-home">
          <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/plantlib" className={({ isActive }) => isActive ? "active" : ""}>Plant Library</NavLink></li>
          <li><NavLink to="/features" className={({ isActive }) => isActive ? "active" : ""}>Features</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
          <li><NavLink to="/urbangrow" className={({ isActive }) => isActive ? "active" : ""}>UrbanGrow</NavLink></li>
        </ul>

        {/* --- Right Section (Profile Dropdown) --- */}
        <div className="profile-dropdown-container">
          <button
            className="profile-icon-btn"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          >
            <FaUserCircle className="profile-icon" />
            <span className="user-name">{displayName}</span>
          </button>

          {isProfileDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleEditProfile}>Profile</button>
              <button onClick={() => setIsLogoutModalOpen(true)}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* --- Logout Confirmation Modal --- */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default AppHeader;
