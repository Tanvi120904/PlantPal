import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom"; // 1. IMPORT ReactDOM for Portals
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { useUser } from "../context/UserContext.jsx";
import LoginModal from "../Components/LoginModal.jsx";
import SignupModal from "../Components/SignupModal.jsx";
import "../Styles/initialpage.css";

// This is the new Modal Portal Component
const ModalPortal = ({ children }) => {
  // Find or create a div with id 'modal-root' in the body
  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  }
  return ReactDOM.createPortal(children, modalRoot);
};


function Initial() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { user } = useUser();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // 2. THIS IS THE REDIRECTION FIX:
  // This effect runs when the 'user' object changes.
  useEffect(() => {
    // If a user object exists, it means login was successful.
    if (user) {
      navigate("/home"); // Reliably redirect to the homepage.
    }
  }, [user, navigate]);


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoSize = Math.max(60, 140 - scrollY * 0.2);

  return (
    <>
      <div className="landing-page">
        <img
          src="/Main.png"
          alt="PlantPal Logo"
          className="logo"
          style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
        />
        <div className="auth-buttons-initial">
          <button className="btn-login-initial" onClick={() => setIsLoginModalOpen(true)}>Login</button>
          <button className="btn-signup-initial" onClick={() => setIsSignupModalOpen(true)}>Sign-up</button>
        </div>
        
        <div className="center-content">
          <h1 className="headline">Welcome to PlantPal</h1>
          <p className="subtext">
            Grow smarter, not harder. 🌱 <br />
            Track your plants, boost their health, <br />
            and enjoy gardening like never before.
          </p>
          <div className="scroll-down-arrows">
            <FiChevronDown size={40} style={{ strokeWidth: 3 }} />
            <FiChevronDown size={40} style={{ strokeWidth: 3 }} />
          </div>
        </div>
        
        <section id="features-section" className="features-section">
          <h2 className="features-heading">Why PlantPal?</h2>
          <div className="features-grid">
              <div className="feature-card">🌱<h3>Soil Health</h3><p>Monitor and improve soil quality for healthier crops.</p></div>
              <div className="feature-card">💧<h3>Water Efficiency</h3><p>Smart irrigation to save water while boosting yield.</p></div>
              <div className="feature-card">☀️<h3>Sunlight Guidance</h3><p>Suggests plant placement for maximum sunlight.</p></div>
              <div className="feature-card">🏙️<h3>Urban Friendly</h3><p>Perfect for rooftops, balconies, and small gardens.</p></div>
              <div className="feature-card">🌾<h3>Organic Tips</h3><p>Grow chemical-free produce with natural practices.</p></div>
              <div className="feature-card">🤝<h3>Community Support</h3><p>Connect with fellow growers and share farming wisdom.</p></div>
          </div>
        </section>
      </div>

      {/* 3. RENDER MODALS INSIDE THE PORTAL */}
      <ModalPortal>
        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSwitchToSignup={() => {
                setIsLoginModalOpen(false);
                setIsSignupModalOpen(true);
            }}
        />
        <SignupModal
            isOpen={isSignupModalOpen}
            onClose={() => setIsSignupModalOpen(false)}
            onSwitchToLogin={() => {
                setIsSignupModalOpen(false);
                setIsLoginModalOpen(true);
            }}
        />
      </ModalPortal>
    </>
  );
}

export default Initial;
