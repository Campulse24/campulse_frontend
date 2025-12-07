import { createContext, useContext, useState, useEffect } from 'react';

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
        const storedUser = localStorage.getItem('campulse_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                localStorage.removeItem('campulse_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if user exists in localStorage (from signup)
                const users = JSON.parse(localStorage.getItem('campulse_users') || '[]');
                const foundUser = users.find(u => u.email === email && u.password === password);

                if (foundUser) {
                    const { password, ...userWithoutPassword } = foundUser;
                    setUser(userWithoutPassword);
                    localStorage.setItem('campulse_user', JSON.stringify(userWithoutPassword));
                    resolve(userWithoutPassword);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    };

    const signup = async (userData) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if email already exists
                const users = JSON.parse(localStorage.getItem('campulse_users') || '[]');
                const emailExists = users.some(u => u.email === userData.email);

                if (emailExists) {
                    reject(new Error('Email already registered'));
                    return;
                }

                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    ...userData,
                    createdAt: new Date().toISOString()
                };

                // Save to users array
                users.push(newUser);
                localStorage.setItem('campulse_users', JSON.stringify(users));

                // Set as current user (without password)
                const { password, ...userWithoutPassword } = newUser;
                setUser(userWithoutPassword);
                localStorage.setItem('campulse_user', JSON.stringify(userWithoutPassword));

                resolve(userWithoutPassword);
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
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
