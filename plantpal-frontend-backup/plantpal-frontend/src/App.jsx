import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useUser } from "./context/UserContext";

import Home from "./Pages/Home.jsx";
import PlantLib from "./Pages/PlantLib.jsx";
import Features from "./Pages/Features.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Profile from "./Pages/Profile.jsx";

import LoginModal from "./Components/LoginModal.jsx";
import SignupModal from "./Components/SignupModal.jsx";

function App() {
  const { user, logoutUser } = useUser(); // ✅ Using context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const authButtonStyles = `
    .auth-buttons-home {
      position: fixed;
      right: 2rem;
      top: 1rem;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      z-index: 2000;
    }

    .btn-login-home,
    .btn-signup-home {
      padding: 8px 18px;
      border-radius: 5px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .btn-login-home {
      background-color: transparent;
      border: 2px solid #4CAF50;
      color: #4CAF50;
    }
    .btn-login-home:hover {
      background-color: #4CAF50;
      color: white;
    }

    .btn-signup-home {
      background-color: #4CAF50;
      color: white;
      border: 2px solid #4CAF50;
    }
    .btn-signup-home:hover {
      background-color: #388E3C;
      border-color: #388E3C;
    }

    .profile-dropdown {
      position: absolute;
      top: 40px;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border-radius: 6px;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
    }

    .profile-dropdown a,
    .profile-dropdown button {
      padding: 8px 12px;
      border: none;
      background: none;
      cursor: pointer;
      text-align: left;
      font-size: 0.95rem;
    }

    .profile-dropdown a:hover,
    .profile-dropdown button:hover {
      background-color: #f0f0f0;
    }

    .profile-icon {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: #0d3b66;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 4px solid #0d3b66;
      cursor: pointer;
      position: relative;
    }

    .profile-icon::before {
      content: "";
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background-color: white;
      position: absolute;
      top: 6px;
    }

    .profile-icon::after {
      content: "";
      width: 30px;
      height: 10px;
      background-color: white;
      position: absolute;
      bottom: 10px;
      border-radius: 12px 12px 0 0;
    }

    .profile-icon:hover {
      transform: scale(1.1);
      background-color: #0b2f55;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease-in-out;
    }
  `;

  return (
    <Router>
      <div>
        <style>{authButtonStyles}</style>

        {/* Auth Buttons or Profile Icon */}
        <div className="auth-buttons-home">
          {!user ? (
            <>
              <button className="btn-login-home" onClick={() => setIsLoginModalOpen(true)}>Login</button>
              <button className="btn-signup-home" onClick={() => setIsModalOpen(true)}>Signup</button>
            </>
          ) : (
            <div style={{ position: "relative" }}>
              <div
                className="profile-icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              ></div>
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>Account</Link>
                  <button onClick={logoutUser}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Pages */}
        <div style={{ paddingTop: "60px" }}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/plantlib" element={<PlantLib />} />
            <Route path="/features" element={<Features />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>

        {/* Modals */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToSignup={() => {
            setIsLoginModalOpen(false);
            setIsModalOpen(true);
          }}
        />
        <SignupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSwitchToLogin={() => {
            setIsModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </div>
    </Router>
  );
}

export default App;
