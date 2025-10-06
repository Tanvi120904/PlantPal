import React, { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from 'axios';
import API_URL from '../config/api';
import '../Styles/AuthModal.css';
import { useUser } from '../context/UserContext.jsx';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
    // --- STATE DEFINITIONS ---
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false); // 1. ADDED: State to track message type

    // Get loginUser function from context
    const { loginUser } = useUser();

    if (!isOpen) {
        return null;
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsError(false); // Reset error state on new submission

        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });

            loginUser(response.data.token);
            setIsError(false); // 2. SET: This is a success message
            setMessage("Login Successful! Redirecting...");

            setEmail('');
            setPassword('');

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Check your credentials.";
            setIsError(true); // 3. SET: This is an error message
            setMessage(errorMessage);
            console.error("Login Error:", error);
            setPassword('');
        }
    };

    const handleSwitchToSignup = (e) => {
        e.preventDefault(); // Prevents the link from adding '#' to the URL
        onSwitchToSignup();
    };
    
    const EyeIcon = isPasswordVisible ? FiEyeOff : FiEye;

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="login-modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Welcome Back!</h2>
                <p className="subtitle">Please log into your account</p>
                <form onSubmit={handleFormSubmit}>

                    <div className="login-modal-input-group">
                        <FiUser className="login-modal-input-icon" />
                        <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="login-modal-input-group">
                        <FiLock className="login-modal-input-icon" />
                        <input type={isPasswordVisible ? 'text' : 'password'} placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <EyeIcon className="login-modal-toggle-password" onClick={togglePasswordVisibility} />
                    </div>

                    <div className="login-modal-forgot-password">
                        <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                    </div>

                    <button type="submit" className="login-modal-submit-btn">Login</button>

                    {/* 4. MODIFIED: Dynamically applies 'success' or 'error' class */}
                    {message && (
                        <p className={`message-text ${isError ? 'error' : 'success'}`}>
                            {message}
                        </p>
                    )}

                    <p className="login-modal-signup-link">
                        Don't have an account? <a href="#" onClick={handleSwitchToSignup}> Signup</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;