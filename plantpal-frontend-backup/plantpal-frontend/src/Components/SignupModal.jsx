import React, { useState } from 'react';
import { FiUser, FiPhone, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from 'axios';
import API_URL from '../config/api';
import { useUser } from '../context/UserContext.jsx';

const styles = `
    .signup-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: flex; justify-content: center; align-items: center;
        z-index: 1000; font-family: 'Segoe UI', sans-serif;
        backdrop-filter: blur(6px);
    }

    .signup-modal-content {
        background: white;
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        width: 100%; max-width: 420px;
        position: relative;
        overflow: hidden;
    }

    .signup-modal-content::before {
        content: "🌿";
        position: absolute;
        font-size: 7rem;
        opacity: 0.08;
        right: -20px;
        bottom: -10px;
        transform: rotate(-10deg);
    }

    .signup-modal-content * {
        position: relative;
        z-index: 1;
    }

    .signup-modal-close-btn {
        position: absolute; top: 10px; right: 15px;
        font-size: 1.8rem; color: #666; cursor: pointer;
        border: none; background: none; transition: color 0.2s ease;
    }
    .signup-modal-close-btn:hover { color: #2e7d32; }

    .signup-modal-content h2 {
        text-align: center; margin-top: 0; margin-bottom: 2rem;
        font-family: 'Georgia', serif; color: #0d5d10;
        font-size: 1.6rem;
    }

    .signup-modal-input-group {
        position: relative; margin-bottom: 1.4rem;
    }
    .signup-modal-input-icon {
        position: absolute; left: 15px; top: 50%;
        transform: translateY(-50%); color: #777;
        font-size: 1.1rem;
        z-index: 2;
    }
    .signup-modal-input-group input {
        width: 100%; padding: 12px 12px 12px 45px;
        border: 1px solid #ccc; border-radius: 10px;
        box-sizing: border-box; font-size: 1rem;
        background-color: #f9fdf9; transition: border-color 0.2s, background 0.3s;
    }
    .signup-modal-input-group input:focus {
        border-color: #4caf50; background-color: #ffffff;
        outline: none; box-shadow: 0 0 0 2px rgba(76,175,80,0.2);
    }

    .signup-modal-toggle-password {
        position: absolute; right: 15px; top: 50%;
        transform: translateY(-50%); cursor: pointer; color: #777;
        font-size: 1.1rem; z-index: 2;
    }
    .signup-modal-toggle-password:hover { color: #2e7d32; }

    .signup-modal-submit-btn {
        width: 100%; padding: 12px;
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        color: white; border: none; border-radius: 10px;
        font-size: 1.1rem; font-weight: bold; cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .signup-modal-submit-btn:hover {
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

    .signup-modal-login-link {
        text-align: center; margin-top: 1.5rem;
        font-size: 0.9rem; color: #555;
    }
    .signup-modal-login-link a {
        color: #2e7d32; font-weight: bold; text-decoration: none; cursor: pointer;
        transition: color 0.2s ease;
    }
    .signup-modal-login-link a:hover { text-decoration: underline; color: #1b5e20; }
`;

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    // State definitions
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

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
        setIsError(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setIsError(false);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            setIsError(true);
            return;
        }

        try {
            // API CALL: Creates the user in the database
            await axios.post(`${API_URL}/auth/signup`, { 
                name,
                email, 
                phone,
                password 
            });
            
            setMessage("Account created successfully! Please log in.");
            setIsError(false);
            
            // Clear all fields
            clearFormFields(); 

            // Redirect to Login Modal
            setTimeout(() => {
                onClose(); 
                if (onSwitchToLogin) {
                    onSwitchToLogin(); 
                }
            }, 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed. Please check input and try again.";
            setMessage(errorMessage);
            setIsError(true);
            console.error("Signup Error:", error);
            setPassword('');
            setConfirmPassword('');
        }
    };

    const EyeIcon = isPasswordVisible ? FiEyeOff : FiEye;

    return (
        <div className="signup-modal-overlay" onClick={onClose}>
            <style>{styles}</style>
            <div className="signup-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="signup-modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Create Your Account</h2>
                
                <form onSubmit={handleFormSubmit}>
                    
                    {/* Name Input */}
                    <div className="signup-modal-input-group">
                        <FiUser className="signup-modal-input-icon" />
                        <input 
                            type="text" 
                            placeholder="Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    {/* Phone Input */}
                    <div className="signup-modal-input-group">
                        <FiPhone className="signup-modal-input-icon" />
                        <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    {/* Email Input */}
                    <div className="signup-modal-input-group">
                        <FiMail className="signup-modal-input-icon" />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div className="signup-modal-input-group">
                        <FiLock className="signup-modal-input-icon" />
                        <input 
                            type={isPasswordVisible ? 'text' : 'password'} 
                            placeholder="Create Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <EyeIcon className="signup-modal-toggle-password" onClick={togglePasswordVisibility} />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="signup-modal-input-group">
                        <FiLock className="signup-modal-input-icon" />
                        <input 
                            type={isPasswordVisible ? 'text' : 'password'} 
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="signup-modal-submit-btn">Signup</button>
                    
                    {message && (
                        <p className={`message-text ${isError ? 'error' : 'success'}`}>
                            {message}
                        </p>
                    )}

                    <p className="signup-modal-login-link">
                        Already have an account? <a onClick={onSwitchToLogin}> Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupModal;