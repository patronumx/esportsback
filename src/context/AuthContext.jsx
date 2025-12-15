import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    // Fix for previously incorrect storage structure
                    if (parsedUser.data && parsedUser.data.user) {
                        console.log('Restoring user (structure A):', parsedUser.data.user.role);
                        setUser(parsedUser.data.user);
                        localStorage.setItem('user', JSON.stringify(parsedUser.data.user));
                    } else if (parsedUser.success && parsedUser.data) {
                        // Another potential bad structure
                        const u = parsedUser.data.user || parsedUser.data;
                        console.log('Restoring user (structure B):', u.role);
                        setUser(u);
                        localStorage.setItem('user', JSON.stringify(u));
                    } else {
                        console.log('Restoring user (direct):', parsedUser.role);
                        setUser(parsedUser);
                    }
                } catch (e) {
                    console.error("Error parsing stored user", e);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        const handleResize = () => { }; // No-op, just placeholder if needed
        const handleLogoutEvent = () => logout();

        window.addEventListener('auth:logout', handleLogoutEvent);
        checkUser();

        return () => {
            window.removeEventListener('auth:logout', handleLogoutEvent);
        };
    }, []);

    const login = async (email, password, role) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            console.log('Login Response:', response.data);
            const { token, user } = response.data.data;

            // Optional: Check role if needed
            // Start Role Check
            if (role && user.role !== role && user.role !== 'admin') {
                console.warn('Role mismatch:', user.role, role);
                throw new Error(`Access denied. This account is registered as a ${user.role}.`);
            }
            // End Role Check

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error('Login Error in Context:', error);
            throw error;
        }
    };

    const loginWithToken = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const updateUser = (userData) => {
        const updated = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, loginWithToken, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
