// src/Pages/Profile.jsx
import { NavLink } from "react-router-dom"; 
import { useState, useEffect } from "react";
import axios from 'axios';
import API_URL from '../config/api';
import { useUser } from '../context/UserContext.jsx';
import "../Styles/Profile.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProfilePage = () => {
  const { user } = useUser();
  
  // State for user profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    totalPlants: 0,
    gardenHealth: 0,
    lastWatered: 'N/A',
    caredForPlants: 0
  });
  
  // State for chart data
  const [chartData, setChartData] = useState([
    { month: 'Jan', health: 0 },
    { month: 'Feb', health: 0 },
    { month: 'Mar', health: 0 },
    { month: 'Apr', health: 0 },
    { month: 'May', health: 0 },
  ]);
  
  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    generalNotifications: false,
    emailUpdates: true,
    smsAlerts: false
  });
  
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setLoading(false);
          return;
        }

        // Fetch user profile
        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data;
        
        // Update profile data
        setProfileData({
          name: userData.name || 'User',
          email: userData.email || '',
          bio: userData.bio || 'Passionate urban gardener and plant enthusiast. Dedicated to nurturing a vibrant indoor oasis and sharing the joy of plant care with the community. Always learning and growing!',
          totalPlants: userData.totalPlants || 0,
          gardenHealth: userData.gardenHealth || 0,
          lastWatered: userData.lastWatered || 'N/A',
          caredForPlants: userData.caredForPlants || 0
        });

        // Update form data
        setFormData(prev => ({
          ...prev,
          fullName: userData.name || '',
          email: userData.email || '',
          generalNotifications: userData.notifications?.general || false,
          emailUpdates: userData.notifications?.email || true,
          smsAlerts: userData.notifications?.sms || false
        }));

        // Fetch garden statistics for chart
        if (userData.gardenStats) {
          setChartData(userData.gardenStats);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage('');
    setIsError(false);

    try {
      const token = localStorage.getItem('token');
      
      const updateData = {
        name: formData.fullName,
        email: formData.email,
        notifications: {
          general: formData.generalNotifications,
          email: formData.emailUpdates,
          sms: formData.smsAlerts
        }
      };

      // Add password if provided
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put(`${API_URL}/user/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUpdateMessage('Profile updated successfully!');
      setIsError(false);
      
      // Update profile data with new values
      setProfileData(prev => ({
        ...prev,
        name: formData.fullName,
        email: formData.email
      }));

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: ''
      }));

      // Clear message after 3 seconds
      setTimeout(() => setUpdateMessage(''), 3000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setUpdateMessage(errorMessage);
      setIsError(true);
      console.error('Update error:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', textAlign: 'center', paddingTop: '100px' }}>
        Loading Profile...
      </div>
    );
  }

  return (
    <div>
      {/* --- Navbar --- */}
      <nav className="navbar-home">
        <div className="navbar-left">
          <img src="/Main.png" alt="PlantPal Logo" className="logo" />
        </div>
        <ul className="nav-links-home">
          <li><NavLink to="/home">Home</NavLink></li>
          <li><NavLink to="/plantlib">Plant Library</NavLink></li>
          <li><NavLink to="/features">Features</NavLink></li>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/urbangrow">UrbanGrow</NavLink></li>
        </ul>
      </nav>

      <div className="profile-page-wrapper">
        <div className="profile-container">
          {/* PROFILE HEADER */}
          <header className="profile-header">
            <div className="profile-header-main">
              <div className="profile-pic-container">
                {/* Add profile image here if needed */}
              </div>
              <div className="profile-info">
                <h1>{profileData.name}</h1>
                <p>{profileData.bio}</p>
              </div>
              <div className="profile-actions">
                <button className="btn btn-secondary">Edit Profile</button>
                <NavLink to="/dashboard" className="btn btn-secondary-outline">
                  View My Garden
                </NavLink>
              </div>
            </div>

            <div className="profile-header-stats">
              <div className="stat-item">
                <span className="stat-value">{profileData.totalPlants}</span>
                <span className="stat-label">Total Plants</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profileData.gardenHealth}%</span>
                <span className="stat-label">Garden Health</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profileData.lastWatered}</span>
                <span className="stat-label">Last Watered</span>
              </div>
            </div>
          </header>

          {/* MAIN GRID */}
          <main className="profile-content">
            {/* LEFT COLUMN */}
            <section className="account-settings-card">
              <h2>Account Settings</h2>
              <p className="card-subtitle">Manage your personal details, password, and notification preferences.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <h3>Notification Preferences</h3>
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="generalNotifications"
                    checked={formData.generalNotifications}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="generalNotifications">Receive general notifications</label>
                </div>
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="emailUpdates"
                    checked={formData.emailUpdates}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="emailUpdates">Email updates about plant health</label>
                </div>
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="smsAlerts"
                    checked={formData.smsAlerts}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="smsAlerts">SMS alerts for urgent care</label>
                </div>

                <button type="submit" className="btn btn-primary btn-full-width">Save Changes</button>
                
                {updateMessage && (
                  <p style={{ 
                    textAlign: 'center', 
                    marginTop: '1rem', 
                    color: isError ? '#d32f2f' : '#2e7d32',
                    fontWeight: '500'
                  }}>
                    {updateMessage}
                  </p>
                )}
              </form>
            </section>

            {/* RIGHT COLUMN */}
            <aside className="sidebar">
              <div className="widget-card">
                <h2>Garden Statistics</h2>
                <p className="card-subtitle">Overview of your plant collection and health trends.</p>
                <div className="overall-health">
                  <p>Overall Garden Health Score</p>
                  <span>{profileData.gardenHealth}%</span>
                </div>
                <div className="garden-summary-stats">
                  <div className="summary-stat-item">
                    <span className="summary-stat-value">{profileData.totalPlants}</span>
                    <span className="summary-stat-label">Total Plants</span>
                  </div>
                  <div className="summary-stat-item">
                    <span className="summary-stat-value">{profileData.caredForPlants}</span>
                    <span className="summary-stat-label">Cared For</span>
                  </div>
                </div>
                <h3>Health Trend</h3>
                <div className="chart-container" style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} ticks={[0,20,40,60,80,100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Line type="monotone" dataKey="health" stroke="#7D9A6B" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="widget-card">
                <h2>Community Hub</h2>
                <p className="card-subtitle">Connect with other gardeners and share your experiences.</p>
                <p>Discover gardening tips, join discussions, and showcase your plant collection to the PlantPal community.</p>
                <button className="btn btn-secondary-outline btn-full-width">Explore Community</button>
                <p className="no-activity-text">No new activity yet. Be the first to post!</p>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;