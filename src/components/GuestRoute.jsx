import { useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';

const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const toastShownRef = useRef(false);

    useEffect(() => {
        if (user && !toastShownRef.current) {
            toastShownRef.current = true;
            showToast.info("You're already logged in!");
        }
    }, [user]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>;
    }

    if (user) {
        // Redirect based on role
        if (user.role === 'admin') {
            return <Navigate to="/sys-admin-secret-login/dashboard" replace />;
        } else if (user.role === 'team') {
            if (user.isPro) {
                return <Navigate to="/pro/dashboard" replace />;
            }
            return <Navigate to="/team/dashboard" replace />;
        } else if (user.role === 'player') {
            return <Navigate to="/player/dashboard" replace />;
        } else {
            return <Navigate to="/talent/pubg-mobile" replace />;
        }
    }

    return children;
};

export default GuestRoute;
