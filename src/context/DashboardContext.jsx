import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
    const { user } = useAuth();

    // Admin State
    const [adminData, setAdminData] = useState(null);
    const [adminLoading, setAdminLoading] = useState(true);
    const [adminError, setAdminError] = useState(null);

    // Team State
    const [teamData, setTeamData] = useState(null);
    const [teamLoading, setTeamLoading] = useState(true);
    const [teamError, setTeamError] = useState(null);

    // Player State (Future proofing)
    const [playerData, setPlayerData] = useState(null);
    const [playerLoading, setPlayerLoading] = useState(true);
    const [playerError, setPlayerError] = useState(null);

    // Reset state on logout
    useEffect(() => {
        if (!user) {
            setAdminData(null);
            setAdminLoading(true);
            setTeamData(null);
            setTeamLoading(true);
            setPlayerData(null);
            setPlayerLoading(true);
        }
    }, [user]);

    // Fetch Admin Data
    const fetchAdminData = useCallback(async (force = false) => {
        if (adminData && !force) {
            setAdminLoading(false); // Ensure loading is false if we have data
            return;
        }

        setAdminLoading(true);
        try {
            const { data } = await api.get('/admin/dashboard');
            setAdminData(data);
            setAdminError(null);
        } catch (error) {
            console.error('Error fetching admin dashboard:', error);
            setAdminError(error);
        } finally {
            setAdminLoading(false);
        }
    }, [adminData]);

    // Fetch Team Data
    const fetchTeamData = useCallback(async (force = false) => {
        if (teamData && !force) {
            setTeamLoading(false);
            return;
        }

        setTeamLoading(true);
        try {
            const { data } = await api.get('/team/dashboard');
            setTeamData(data);
            setTeamError(null);
        } catch (error) {
            console.error('Error fetching team dashboard:', error);
            setTeamError(error);
        } finally {
            setTeamLoading(false);
        }
    }, [teamData]);

    const value = {
        adminData,
        adminLoading,
        adminError,
        fetchAdminData,

        teamData,
        teamLoading,
        teamError,
        fetchTeamData,

        // Expose setters if specific pages need to update local state optimistically
        setAdminData,
        setTeamData
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
