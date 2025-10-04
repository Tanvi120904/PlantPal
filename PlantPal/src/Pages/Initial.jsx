import { FaArrowRight } from "react-icons/fa"; 
import "../Styles/initialpage.css";
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Initial() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoSize = Math.max(60, 140 - scrollY * 0.2);

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className="landing-page">
      {/* Logo top-left */}
      <img
        src="/Main.png"
        alt="PlantPal Logo"
        className="logo"
        style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
      />

      {/* Center content */}
      <div className="center-content">
        <h1 className="headline">Welcome to PlantPal</h1>

        <p className="subtext">
          Grow smarter, not harder. 🌱 <br />
          Track your plants, boost their health, <br />
          and enjoy gardening like never before.
        </p>
          
        <button className="get-started-btn" onClick={goToHome}>
          Get Started <FaArrowRight style={{ marginLeft: "10px" }} />
        </button>

        {/* Scroll down arrows */}
        <div className="scroll-down-arrows">
          <FiChevronDown size={40} style={{ strokeWidth: 3 }} />
          <FiChevronDown size={40} style={{ strokeWidth: 3 }} />
        </div>
      </div>

      {/* Features Section */}
      <section id="features-section" className="features-section">
        <h2 className="features-heading">Why PlantPal?</h2>
        <div className="features-grid">
          <div className="feature-card">
            🌱
            <h3>Soil Health</h3>
            <p>Monitor and improve soil quality for healthier crops.</p>
          </div>
          <div className="feature-card">
            💧
            <h3>Water Efficiency</h3>
            <p>Smart irrigation to save water while boosting yield.</p>
          </div>
          <div className="feature-card">
            ☀️
            <h3>Sunlight Guidance</h3>
            <p>Suggests plant placement for maximum sunlight.</p>
          </div>
          <div className="feature-card">
            🏙️
            <h3>Urban Friendly</h3>
            <p>Perfect for rooftops, balconies, and small gardens.</p>
          </div>
          <div className="feature-card">
            🌾
            <h3>Organic Tips</h3>
            <p>Grow chemical-free produce with natural practices.</p>
          </div>
          <div className="feature-card">
            🤝
            <h3>Community Support</h3>
            <p>Connect with fellow growers and share farming wisdom.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Initial;
