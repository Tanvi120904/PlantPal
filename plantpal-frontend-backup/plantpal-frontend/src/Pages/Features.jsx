// src/pages/Features.jsx
import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import '../Styles/Features.css'; 
import '../Styles/Home.css'; 
import StartWatering from './StartWatering';
import SoilHealth from './SoilHealth';
import PestControl from './PestControl';

function Features() {
  const [activeFeature, setActiveFeature] = useState(null);

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'water': return <StartWatering />;
      case 'soil': return <SoilHealth />;
      case 'pest': return <PestControl />;
      default: return null;
    }
  };

  return (
    <div>
      {/* Navbar */}
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
      </nav>

      {/* Features Page Content */}
      <div className="features-container">
        {activeFeature ? (
          <>
            <button className="back-button" onClick={() => setActiveFeature(null)}>← Back</button>
            <div className="active-feature-content">
              {renderActiveFeature()}
            </div>
          </>
        ) : (
          <>
            <h1 className="features-title">
              <FaLeaf className="leaf-icon" /> Core Features
            </h1>

            <div className="core-features-grid">
              {[
                {
                  title: "Water System",
                  desc: "Automatically schedules and delivers the perfect amount of water, so your plants are always hydrated.",
                  action: () => setActiveFeature('water'),
                  btnText: "Start watering →"
                },
                {
                  title: "Soil Health Monitoring",
                  desc: "Get real-time data on your soil's moisture and nutrient levels to ensure your plants have the ideal environment.",
                  action: () => setActiveFeature('soil'),
                  btnText: "Measure Health →"
                },
                {
                  title: "Pest Control & Early Warning",
                  desc: "The Pest Patrol feature uses AI to identify pests from photos and provides a quick, step-by-step treatment plan.",
                  action: () => setActiveFeature('pest'),
                  btnText: "Scan & Check →"
                }
              ].map((feature, index) => (
                <div key={index} className="feature-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                  <button onClick={feature.action}>{feature.btnText}</button>
                </div>
              ))}
            </div>

            <h2 className="learn-more-title">
              Learn about UrbanGrow <span className="green-arrows">≫≫≫</span>
            </h2>

            <div className="urban-grow-section">
              <div className="urban-grow-text">
                <p>
                  UrbanGrow is all about bringing the joy of farming into everyday city life. It reimagines small spaces like balconies, terraces, and walls using layered planting techniques that make every row count. It turns limited space into opportunity — helping you design vertical gardens that blend herbs, vegetables, and flowers in neat, space-saving layers.
                </p>
              </div>
              <div className="urban-grow-image-container">
                <img src="/Urban1.jpeg" alt="Lush urban balcony garden" className="urban-grow-image" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Features;
