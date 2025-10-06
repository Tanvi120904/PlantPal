import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiAuth from '../utils/apiAuth';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isCheckingToken, setIsCheckingToken] = useState(true);

    const fetchUserProfile = async () => {
        try {
            const res = await apiAuth.get('/auth/me');
            setUser(res.data);
            return res.data; // Return the user profile on success
        } catch (err) {
            console.error("Failed to fetch profile:", err);
            localStorage.removeItem('userToken');
            setUser(null);
            return null; // Return null on failure
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    fetchUserProfile().finally(() => setIsCheckingToken(false));
                } else {
                    localStorage.removeItem('userToken');
                    setIsCheckingToken(false);
                }
            } catch (error) {
                localStorage.removeItem('userToken');
                setIsCheckingToken(false);
            }
        } else {
            setIsCheckingToken(false);
        }
    }, []);

    // MODIFIED: loginUser now handles the navigation
    const loginUser = async (token, navigate) => {
        localStorage.setItem('userToken', token);
        const userProfile = await fetchUserProfile();
        
        // If the profile was fetched successfully, then redirect
        if (userProfile && navigate) {
            navigate('/home');
        }
    };

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