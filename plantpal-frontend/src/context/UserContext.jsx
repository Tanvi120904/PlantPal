import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiAuth from '../utils/apiAuth';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // ✅ fetchUserProfile stays same, but handle errors more safely
  const fetchUserProfile = async () => {
    try {
      const res = await apiAuth.get('/auth/me');
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err);
      localStorage.removeItem('userToken');
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return setIsCheckingToken(false);

      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          await fetchUserProfile();
        } else {
          localStorage.removeItem('userToken');
        }
      } catch (error) {
        localStorage.removeItem('userToken');
      } finally {
        setIsCheckingToken(false);
      }
    };

    verifyToken();
  }, []);

  // ✅ Cleaner login handler — returns success/failure
  const loginUser = async (token, navigate) => {
    try {
      localStorage.setItem('userToken', token);
      const userProfile = await fetchUserProfile();

      if (userProfile) {
        if (navigate) navigate('/home');
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        isCheckingToken,
        isLoggedIn: !!user, // ✅ Optional helper
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
