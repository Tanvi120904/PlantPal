import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import '../Styles/Home.css';
// Modal and useState imports are no longer needed here

function Home() {
    // The state and handlers for modals have been removed.

    return (
        <div className="home-page-container">
            {/* The <nav> element has been removed from this component. */}
            {/* The AppHeader with navigation and the Logout button will be rendered by the AuthWrapper. */}
            
            {/* Main Hero Section */}
            <div className="hero-section-home">
                <div className="hero-content-home">
                    <motion.h1
                        className="headline-home"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Your Green Journey Starts Here
                    </motion.h1>
                    <motion.p
                        className="subtext-home"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        PlantPal simplifies plant care with smart monitoring, personalized tips, and a vibrant community. Grow happier, healthier plants effortlessly.
                    </motion.p>
                    <div className="hero-buttons-home">
                        <NavLink to="/Plantlib">
                        <button className="btn-primary-home">
                        Explore Plant Library
                        </button>
                        </NavLink>
                        <button className="btn-secondary-home">See Diagnostics</button>
                    </div>
                </div>
            </div>

            {/* The rest of your page content remains the same */}
            <div className="features-section-home">
                {/* ... */}
                 <h2 className="features-heading-home">Discover PlantPal's Core Features</h2>
                <p className="features-subtext-home">PlantPal simplifies plant care with innovative tools designed for every gardener.</p>
                <div className="features-cards-container-home">
                    <div className="feature-card-home">
                        <h3>Smart Watering System</h3>
                        <p>Automatically schedules and delivers the perfect amount of water, so your plants are always hydrated without the guesswork.</p>
                    </div>
                    <div className="feature-card-home">
                        <h3>Soil Health Monitoring</h3>
                        <p>Get real-time data on your soil's moisture and nutrient levels to ensure your plants have the ideal environment to thrive.</p>
                    </div>
                    <div className="feature-card-home">
                        <h3>Pest Patrol & Early Warning 🚨</h3>
                        <p>The Pest Patrol feature uses AI to identify pests from photos and provides a quick, step-by-step treatment plan to protect your plants.</p>
                    </div>
                </div>
            </div>
            <div className="testimonials-section-home">
                {/* ... */}
                 <div className="testimonials-header-home">
                    <h2>What Our Community Says</h2>
                    <p>Hear from passionate gardeners who transformed their plant care with PlantPal.</p>
                </div>
                <div className="testimonials-cards-container-home">
                    <div className="testimonial-card-home">
                        <p>"PlantPal has transformed my approach to gardening! My plants have never looked healthier, and the care reminders are a lifesaver."</p>
                        <div className="reviewer-info-home">
                            <span className="reviewer-name-home">David L</span>
                        </div>
                    </div>
                    <div className="testimonial-card-home">
                        <p>"The plant library is incredibly detailed, and the community support is fantastic! I've learned so much about my tricky orchids."</p>
                        <div className="reviewer-info-home">
                            <span className="reviewer-name-home">Emily R.</span>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer-home">
                {/* ... */}
                <div className="footer-links-home">
                    <span>PlantPal</span>
                    <span>Resources</span>
                    <span>Legal</span>
                </div>
            </footer>
             {/* Modals have been removed from here and are now in Initial.js */}
        </div>
    );
}

export default Home;