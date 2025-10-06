import React, { useState } from 'react';
import { FiUser, FiPhone, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from 'axios';
import API_URL from '../config/api'; // Path to src/config/api.js
import '../Styles/AuthModal.css'; // Path to src/Styles/AuthModal.css
import { useUser } from '../context/UserContext.jsx';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    // State definitions
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) {
        return null;
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const clearFormFields = () => {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setMessage('');
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        if (password !== confirmPassword) {
            setMessage("Error: Passwords do not match.");
            return;
        }

        try {
            // API CALL: Creates the user in the database
            await axios.post(`${API_URL}/auth/signup`, { 
                email, 
                password 
            });
            
            setMessage("Account created successfully! Please log in.");
            
            // 1. Clear all fields
            clearFormFields(); 

            // 2. Redirect to Login Modal (by closing Signup and opening Login)
            setTimeout(() => {
                onClose(); 
                if (onSwitchToLogin) {
                    onSwitchToLogin(); 
                }
            }, 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed. Please check input and try again.";
            setMessage(errorMessage);
            console.error("Signup Error:", error);
            setPassword('');
            setConfirmPassword('');
        }
    };

    const EyeIcon = isPasswordVisible ? FiEyeOff : FiEye;

    return (
        <div className="signup-modal-overlay" onClick={onClose}>
            <div className="signup-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="signup-modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Create Your Account</h2>
                
                <form onSubmit={handleFormSubmit}>
                    
                    {/* Name Input */}
                    <div className="signup-modal-input-group">
                        <FiUser className="signup-modal-input-icon" />
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    
                    {/* Phone Input */}
                    <div className="signup-modal-input-group">
                        <FiPhone className="signup-modal-input-icon" />
                        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    
                    {/* Email Input */}
                    <div className="signup-modal-input-group">
                        <FiMail className="signup-modal-input-icon" />
                        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    
                    {/* Password Input */}
                    <div className="signup-modal-input-group">
                        <FiLock className="signup-modal-input-icon" />
                        <input type={isPasswordVisible ? 'text' : 'password'} placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <EyeIcon className="signup-modal-toggle-password" onClick={togglePasswordVisibility} />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="signup-modal-input-group">
                        <FiLock className="signup-modal-input-icon" />
                        <input type={isPasswordVisible ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>


                    <button type="submit" className="signup-modal-submit-btn">Signup</button>
                    
                    {message && <p className="message-text" style={{ textAlign: 'center', marginTop: '10px' }}>{message}</p>}

                    <p className="signup-modal-login-link">
                        Already have an account? <a onClick={onSwitchToLogin}> Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupModal;