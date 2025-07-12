import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedUser && isLoggedIn === 'true') {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (credentials) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedUser && storedUser.email === credentials.email) {
      setUser(storedUser);
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    alert('Invalid email or password');
    return false;
  };

  const register = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user,
      login,
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);