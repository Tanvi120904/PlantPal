// src/pages/Features.jsx
import React, { useState } from 'react';
import '../Styles/Features.css'; 
import '../Styles/Home.css'; // ✅ for navbar reuse
import StartWatering from './StartWatering';
import AppHeader from "../Components/AppHeader.jsx"; 
import SoilHealth from './SoilHealth';
import PestControl from './PestControl';


function Features() {
  const [activeFeature, setActiveFeature] = useState(null);

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'water':
        return <StartWatering />;
      case 'soil':
        return <SoilHealth/>;
      case 'pest':
        return <PestControl />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <AppHeader 
    onLoginClick={() => navigate('/home')} 
    onSignupClick={() => navigate('/home')}
/>

      {/* ✅ Features Page Content */}
      <div className="features-container">
        {activeFeature ? (
          <>
            <button className="back-button" onClick={() => setActiveFeature(null)}>
              ← Back
            </button>
            <div className="active-feature-content">
              {renderActiveFeature()}
            </div>
          </>
        ) : (
          <>
            <h1 className="features-title">Core Features</h1>

            <div className="core-features-grid">

              {/* Water System Card */}
              <div className="feature-card">
                <h3>Water System</h3>
                <p>Automatically schedules and delivers the perfect amount of water, so your plants are always hydrated.</p>
                <button onClick={() => setActiveFeature('water')}>
                  Start watering &rarr;
                </button>
              </div>

              {/* Soil Health Card */}
              <div className="feature-card">
                <h3>Soil Health Monitoring</h3>
                <p>Get real-time data on your soil's moisture and nutrient levels to ensure your plants have the ideal environment.</p>
                <button onClick={() => setActiveFeature('soil')}>
                  Measure Health &rarr;
                </button>
              </div>

              {/* Pest control Card */}
              <div className="feature-card">
                <h3>Pest Control & Early Warning</h3>
                <p>The Pest Patrol feature uses AI to identify pests from photos and provides a quick, step-by-step treatment plan.</p>
                <button onClick={() => setActiveFeature('pest')}>
                  Scan & check &rarr;
                </button>
              </div>
            </div>

            <h2 className="learn-more-title">
              Learn about UrbanGrow <span className="green-arrows">&gt;&gt;&gt;</span>
            </h2>

            <div className="urban-grow-section">
              <div className="urban-grow-text">
                <p>
                UrbanGrow is all about bringing the joy of farming into everyday city life. It reimagines small spaces like balconies, terraces, and even walls by using layered planting techniques that make every row count. Instead of seeing limited space as a challenge, UrbanGrow turns it into an opportunity — helping you design vertical gardens that blend herbs, vegetables, and flowers in neat, space-saving layers. With simple layouts, easy-to-follow ideas, and seasonal tips, it makes growing your own little green haven both enjoyable and practical. Whether you dream of a balcony filled with fresh herbs for cooking, a terrace lined with colorful blooms, or a wall that doubles as a vertical veggie patch, UrbanGrow shows you how to make the most of your urban space while adding beauty, freshness, and sustainability to your home.
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