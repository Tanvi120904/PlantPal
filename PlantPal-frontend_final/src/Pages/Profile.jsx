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
  const { user, setUser } = useUser();  // ✅ access global user context
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    totalPlants: 0,
    gardenHealth: 0,
    lastWatered: 'N/A',
    caredForPlants: 0
  });
  
  const [chartData, setChartData] = useState([]);
  
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

  // ✅ Fetch user data directly from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setLoading(false);

        const res = await axios.get(`${API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = res.data;

        // ✅ update local and global user
        setProfileData({
          name: userData.name,
          email: userData.email,
          bio: userData.bio || "Passionate urban gardener and plant enthusiast. Dedicated to nurturing a vibrant indoor oasis and sharing the joy of plant care.",
          totalPlants: userData.totalPlants || 0,
          gardenHealth: userData.gardenHealth || 0,
          lastWatered: userData.lastWatered ? new Date(userData.lastWatered).toLocaleDateString() : "N/A",
          caredForPlants: userData.caredForPlants || 0
        });

        setFormData(prev => ({
          ...prev,
          fullName: userData.name,
          email: userData.email,
          generalNotifications: userData.notifications?.general || false,
          emailUpdates: userData.notifications?.email || true,
          smsAlerts: userData.notifications?.sms || false
        }));

        if (userData.gardenStats) setChartData(userData.gardenStats);

        // ✅ Update global user context
        setUser(userData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [setUser]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage('');

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.fullName,
        email: formData.email,
        notifications: {
          general: formData.generalNotifications,
          email: formData.emailUpdates,
          sms: formData.smsAlerts
        },
        ...(formData.currentPassword && formData.newPassword
          ? {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
            }
          : {})
      };

      const res = await axios.put(`${API_URL}/user/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUpdateMessage('✅ Profile updated successfully!');
      setIsError(false);

      // ✅ Update both local + global data
      setProfileData(prev => ({
        ...prev,
        name: formData.fullName,
        email: formData.email,
      }));

      setUser(prev => ({
        ...prev,
        name: formData.fullName,
        email: formData.email,
      }));

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: ''
      }));

      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      setUpdateMessage(`❌ ${message}`);
      setIsError(true);
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
      {/* ✅ Navbar with actual user name */}
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
        <div className="navbar-right">
          <span className="user-name">{profileData.name}</span>
        </div>
      </nav>

      <div className="profile-page-wrapper">
        <div className="profile-container">
          {/* --- Profile Header --- */}
          <header className="profile-header">
            <div className="profile-header-main">
              <div className="profile-pic-container">
                <img src="/user.png" alt="User" className="profile-pic" />
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

          {/* --- Main Grid --- */}
          <main className="profile-content">
            {/* --- Account Settings --- */}
            <section className="account-settings-card">
              <h2>Account Settings</h2>
              <p className="card-subtitle">Manage your personal details, password, and preferences.</p>

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

            {/* --- Sidebar --- */}
            <aside className="sidebar">
              <div className="widget-card">
                <h2>Garden Statistics</h2>
                <div className="overall-health">
                  <p>Overall Garden Health Score</p>
                  <span>{profileData.gardenHealth}%</span>
                </div>
                <div className="chart-container" style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="health" stroke="#7D9A6B" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
