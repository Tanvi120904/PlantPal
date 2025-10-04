import React, { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from 'axios';
// Adjust path if your structure is different (e.g., if you are in src/Components, this path is correct)
import API_URL from '../config/api'; 
import '../Styles/AuthModal.css'; // Path to your external CSS file
import { useUser } from '../context/UserContext.jsx';
const LoginModal = ({ isOpen, onClose, onSwitchToSignup, onLoginSuccess }) => {
    // --- STATE DEFINITIONS ---
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [message, setMessage] = useState(''); // State for success/error messages
    
    if (!isOpen) {
        return null;
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            // API CALL: Authenticate user using email and password
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            
            // 1. Success: Save the JWT token
            localStorage.setItem('userToken', response.data.token); 
            
            setMessage("Login Successful! Redirecting...");
            
            // 2. Clear form fields and prepare for redirect
            setEmail('');
            setPassword('');

            setTimeout(() => {
                onClose();
                // Triggers the navigate('/dashboard') function passed from the parent component
                if (onLoginSuccess) {
                    onLoginSuccess(); 
                }
            }, 1000);

        } catch (error) {
            // Handle authentication errors (e.g., 401 Unauthorized)
            const errorMessage = error.response?.data?.message || "Login failed. Check your credentials.";
            setMessage(errorMessage);
            console.error("Login Error:", error);
            setPassword(''); // Clear password field on failure for security
        }
    };

    // Forgot Password Method (Simple Alert for Project Scope)
    const handleForgotPassword = (e) => {
        e.preventDefault();
        alert('Password reset feature is currently under development. Please contact support.');
    }

    const EyeIcon = isPasswordVisible ? FiEyeOff : FiEye;

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="login-modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Welcome Back!</h2>
                <p className="subtitle">Please log into your account</p>
                <form onSubmit={handleFormSubmit}>
                    
                    {/* 1. Email Input: Correctly bound to the 'email' state */}
                    <div className="login-modal-input-group">
                        <FiUser className="login-modal-input-icon" />
                        <input 
                            type="email" 
                            placeholder="Enter Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    
                    {/* 2. Password Input: Correctly bound to the 'password' state */}
                    <div className="login-modal-input-group">
                        <FiLock className="login-modal-input-icon" />
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <EyeIcon
                            className="login-modal-toggle-password"
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                    
                    <div className="login-modal-forgot-password">
                        <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
                    </div>
                    
                    <button type="submit" className="login-modal-submit-btn">Login</button>
                    
                    {message && <p className="message-text" style={{ textAlign: 'center', marginTop: '10px' }}>{message}</p>}

                    <p className="login-modal-signup-link">
                        Don't have an account? <a onClick={onSwitchToSignup}> Signup</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;