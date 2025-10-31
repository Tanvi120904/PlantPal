import React, { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from 'axios';
import API_URL from '../config/api';
import { useUser } from '../context/UserContext.jsx';

// --- ALL CSS STYLES ARE EMBEDDED HERE ---
const styles = `
    .login-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: flex; justify-content: center; align-items: center;
        z-index: 1000; font-family: 'Segoe UI', sans-serif;
        backdrop-filter: blur(6px);
    }

    .login-modal-content {
        background: white;
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        width: 100%; max-width: 420px;
        position: relative;
        overflow: hidden;
    }

    /* 🌸 Minimal decorative flowers & leaves */
    .login-modal-content::before {
        content: "🌸🍃🌼🍂";
        position: absolute;
        font-size: 6rem;
        opacity: 0.08;
        left: -15px;
        top: -10px;
        transform: rotate(-15deg);
    }

    .login-modal-content * {
        position: relative;
        z-index: 1;
    }

    .login-modal-close-btn {
        position: absolute; top: 10px; right: 15px;
        font-size: 1.8rem; color: #666; cursor: pointer;
        border: none; background: none; transition: color 0.2s ease;
    }
    .login-modal-close-btn:hover { color: #2e7d32; }

    .login-modal-content h2 {
        text-align: center; margin-top: 0; margin-bottom: 0.5rem;
        font-family: 'Georgia', serif; color: #0d5d10;
        font-size: 1.8rem;
    }
    .login-modal-content .subtitle {
        text-align: center; margin-bottom: 2rem; color: #555;
        font-size: 1rem;
    }

    .login-modal-input-group {
        position: relative; margin-bottom: 1.4rem;
    }
    .login-modal-input-icon {
        position: absolute; left: 15px; top: 50%;
        transform: translateY(-50%); color: #777;
        font-size: 1.1rem;
        z-index: 2;
    }
    .login-modal-input-group input {
        width: 100%; padding: 12px 12px 12px 45px;
        border: 1px solid #ccc; border-radius: 10px;
        box-sizing: border-box; font-size: 1rem;
        background-color: #f9fdf9; transition: border-color 0.2s, background 0.3s;
    }
    .login-modal-input-group input:focus {
        border-color: #4caf50; background-color: #ffffff;
        outline: none; box-shadow: 0 0 0 2px rgba(76,175,80,0.2);
    }

    .login-modal-toggle-password {
        position: absolute; right: 15px; top: 50%;
        transform: translateY(-50%); cursor: pointer; color: #777;
        font-size: 1.1rem; z-index: 2;
    }
    .login-modal-toggle-password:hover { color: #2e7d32; }

    .login-modal-forgot-password {
        text-align: right; font-size: 0.9rem; margin-top: -1rem;
        margin-bottom: 1.5rem;
    }
    .login-modal-forgot-password a {
        color: #2e7d32; text-decoration: none; cursor: pointer;
    }
    .login-modal-forgot-password a:hover { text-decoration: underline; }

    .login-modal-submit-btn {
        width: 100%; padding: 12px;
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        color: white; border: none; border-radius: 10px;
        font-size: 1.1rem; font-weight: bold; cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .login-modal-submit-btn:hover {
        background: linear-gradient(135deg, #43a047, #1b5e20);
        box-shadow: 0 4px 12px rgba(46,125,50,0.25);
    }

    .message-text {
        text-align: center; margin-top: 1rem;
        font-size: 0.95rem; font-weight: 500;
    }
    .message-text.success {
        color: #2e7d32;
    }
    .message-text.error {
        color: #d32f2f;
    }

    .login-modal-signup-link {
        text-align: center; margin-top: 1.5rem;
        font-size: 0.9rem; color: #555;
    }
    .login-modal-signup-link a {
        color: #2e7d32; font-weight: bold; text-decoration: none; cursor: pointer;
        transition: color 0.2s ease;
    }
    .login-modal-signup-link a:hover { text-decoration: underline; color: #1b5e20; }
`;

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
    // --- STATE DEFINITIONS ---
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

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
        setIsError(false);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });

            loginUser(response.data.token);
            setIsError(false);
            setMessage("Login Successful! Redirecting...");

            setEmail('');
            setPassword('');

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Check your credentials.";
            setIsError(true);
            setMessage(errorMessage);
            console.error("Login Error:", error);
            setPassword('');
        }
    };

    const handleSwitchToSignup = (e) => {
        e.preventDefault();
        onSwitchToSignup();
    };
    
    const EyeIcon = isPasswordVisible ? FiEyeOff : FiEye;

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <style>{styles}</style>
            <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="login-modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Welcome Back!</h2>
                <p className="subtitle">Please log into your account</p>
                <form onSubmit={handleFormSubmit}>

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

                    <div className="login-modal-input-group">
                        <FiLock className="login-modal-input-icon" />
                        <input 
                            type={isPasswordVisible ? 'text' : 'password'} 
                            placeholder="Enter Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <EyeIcon className="login-modal-toggle-password" onClick={togglePasswordVisibility} />
                    </div>

                    <div className="login-modal-forgot-password">
                        <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                    </div>

                    <button type="submit" className="login-modal-submit-btn">Login</button>

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