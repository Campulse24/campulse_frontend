import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing user on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('campulse_token');
            if (token) {
                try {
                    // Get current user from backend
                    const userData = await authAPI.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to get current user:', error);
                    localStorage.removeItem('campulse_token');
                    localStorage.removeItem('campulse_user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            // Call backend API
            const response = await authAPI.login(email, password);

            // Store token and user data
            localStorage.setItem('campulse_token', response.access_token);
            localStorage.setItem('campulse_user', JSON.stringify(response.user));
            setUser(response.user);

            return response.user;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Login failed');
        }
    };

    const signup = async (userData) => {
        try {
            // Call backend API
            const response = await authAPI.signup(userData);

            // Store token and user data
            localStorage.setItem('campulse_token', response.access_token);
            localStorage.setItem('campulse_user', JSON.stringify(response.user));
            setUser(response.user);

            return response.user;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Signup failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('campulse_token');
        localStorage.removeItem('campulse_user');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
