import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiAuth from '../utils/apiAuth'; // <-- axios instance with baseURL + auth headers

// Create Context
const UserContext = createContext();

// Custom hook
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isCheckingToken, setIsCheckingToken] = useState(true);

    // Fetch user profile from backend using token
    const fetchUserProfile = async (token) => {
        try {
            const res = await apiAuth.get('/auth/me'); 
            // Ensure backend returns { id, name, email }
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            localStorage.removeItem('userToken');
            setUser(null);
        } finally {
            setIsCheckingToken(false);
        }
    };

    // Check token on app load
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    // Token valid → fetch full profile
                    fetchUserProfile(token);
                } else {
                    // Token expired
                    localStorage.removeItem('userToken');
                    setIsCheckingToken(false);
                }
            } catch (error) {
                console.error("Invalid token found:", error);
                localStorage.removeItem('userToken');
                setIsCheckingToken(false);
            }
        } else {
            setIsCheckingToken(false);
        }
    }, []);

    // Login function
    const loginUser = async (token) => {
        try {
            localStorage.setItem('userToken', token);
            await fetchUserProfile(token);
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    // Logout function
    const logoutUser = () => {
        localStorage.removeItem('userToken');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, isCheckingToken }}>
            {children}
        </UserContext.Provider>
    );
};
