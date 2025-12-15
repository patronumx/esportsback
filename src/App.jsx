import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import TeamLayout from './layouts/TeamLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hyperspeed from './components/Hyperspeed';
import GuestRoute from './components/GuestRoute';
import { showToast } from './utils/toast';
import { useEffect, useRef } from 'react';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Brands from './pages/Brands';
import CompetitiveEsports from './pages/CompetitiveEsports';
import CreatorsPartners from './pages/CreatorsPartners';
import FAQ from './pages/FAQ';
import JoinUs from './pages/JoinUs';
import MediaCoverage from './pages/MediaCoverage';
import TechAntiCheat from './pages/TechAntiCheat';
import NotFound from './pages/NotFound';
import LoginSelection from './pages/LoginSelection';
import Talent from './pages/Talent';
import PUBGMobile from './pages/talent/PUBGMobile';
import ComingSoonGame from './pages/talent/ComingSoonGame';

// Auth Pages
import PlayerSignup from './pages/auth/PlayerSignup';
import TeamSignup from './pages/auth/TeamSignup';
import PlayerLogin from './pages/auth/PlayerLogin';
import UnifiedLogin from './pages/auth/UnifiedLogin';
import ProLogin from './pages/auth/ProLogin';
import ProDashboard from './pages/pro/Dashboard';

// Event Pages
import PMGC2025 from './pages/events/PMGC2025';
import PGC2025 from './pages/events/PGC2025';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminTeams from './pages/admin/Teams';
import AdminTeamDetails from './pages/admin/TeamDetails';
import AdminEvents from './pages/admin/Events';
import AdminMedia from './pages/admin/Media';
import AdminPerformance from './pages/admin/Performance';
import AdminRevisions from './pages/admin/RevisionRequests';
import AdminNotifications from './pages/admin/Notifications';
import Moderators from './pages/admin/Moderators';
import AdminAnalytics from './pages/admin/Analytics';
import AdminRequests from './pages/admin/Requests';

// Team Pages
import TeamDashboard from './pages/team/Dashboard';
import TeamEvents from './pages/team/Events';
import TeamMedia from './pages/team/Media';
import TeamPerformance from './pages/team/Performance';
import TeamRoster from './pages/team/Roster';
import TeamSocial from './pages/team/Social';
import TeamRevisions from './pages/team/Revisions';
import TeamNotifications from './pages/team/Notifications';
import TeamRecruitments from './pages/team/Recruitments';

import ScoutPlayers from './pages/team/ScoutPlayers';
import SupportStaff from './pages/team/SupportStaff';
import SocialsSettings from './pages/team/SocialsSettings';
import Maps from './pages/team/strategy/Maps';
import VideoAnalysis from './pages/team/strategy/VideoAnalysis';
import Rotations from './pages/team/strategy/Rotations';
import TeamDrops from './pages/team/strategy/TeamDrops';
import PlayerMatches from './pages/player/Matches';
import PlayerDashboard from './pages/player/Dashboard';
import BrowseTeams from './pages/player/BrowseTeams';
import TeamProfile from './pages/player/TeamProfile';
import PlayerRequests from './pages/player/Requests';
import PlayerLayout from './layouts/PlayerLayout';


// Public Layout Component
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <div className="fixed inset-0 z-0">
        <Hyperspeed />
      </div>
      <Navbar />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Custom hook to trigger toast once
const useRedirectToast = (condition, message) => {
  useEffect(() => {
    if (condition) {
      showToast.warning(message);
    }
  }, [condition, message]);
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole, isProRequired }) => {
  const { user, loading } = useAuth();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!loading) {
      if (!user && !toastShownRef.current) {
        toastShownRef.current = true;
        showToast.error("Access Denied: Please login to continue.");
      } else if (user && allowedRole && user.role !== allowedRole && !toastShownRef.current) {
        toastShownRef.current = true;
        showToast.warning(`Access Denied: You are not authorized as a ${allowedRole}`);
      } else if (user && isProRequired && !user.isPro && !toastShownRef.current) {
        toastShownRef.current = true;
        showToast.error("Access Denied: This area is for Pro Teams only.");
      }
    }
  }, [user, loading, allowedRole, isProRequired]);

  if (loading) return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>;

  if (!user) {
    if (allowedRole === 'player') {
      return <Navigate to="/talent/player/login" />;
    }
    // If they were trying to go to /pro, redirect to /pro/login
    if (isProRequired) return <Navigate to="/pro/login" />;

    // For admin, we don't want to redirect to the secret login if they are just a guest hitting a protected route blindly.
    // But if they are trying to access admin, they likely know the URL. 
    // Let's redirect to the secret login.
    return <Navigate to={allowedRole === 'admin' ? '/sys-admin-secret-login/auth' : '/team/login'} />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/talent/pubg-mobile" />;
  }

  // Pro Check
  if (isProRequired && !user.isPro) {
    return <Navigate to="/team/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #7c3aed',
          },
        }} />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/competitive-esports" element={<CompetitiveEsports />} />
            <Route path="/creators-partners" element={<CreatorsPartners />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/media-coverage" element={<MediaCoverage />} />
            <Route path="/tech-anti-cheat" element={<TechAntiCheat />} />
            <Route path="/events/pmgc-2025" element={<PMGC2025 />} />
            <Route path="/events/pgc-2025" element={<PGC2025 />} />
            <Route path="/talent" element={<Talent />} />
            <Route path="/talent/pubg-mobile" element={<PUBGMobile />} />
            <Route path="/talent/coming-soon" element={<ComingSoonGame />} />

            {/* Auth Routes inside Public Layout (Transparent) */}
            <Route path="/team/login" element={<GuestRoute><UnifiedLogin type="team" /></GuestRoute>} />
            <Route path="/sys-admin-secret-login/auth" element={<GuestRoute><UnifiedLogin type="admin" /></GuestRoute>} />
            <Route path="/pro/login" element={<GuestRoute><ProLogin /></GuestRoute>} />
            <Route path="/talent/player/signup" element={<GuestRoute><PlayerSignup /></GuestRoute>} />
            <Route path="/talent/team/signup" element={<GuestRoute><TeamSignup /></GuestRoute>} />
            <Route path="/talent/player/login" element={<GuestRoute><PlayerLogin /></GuestRoute>} />
          </Route>

          {/* Login Selection */}
          <Route path="/login" element={<LoginSelection />} />

          {/* Pro Team Routes */}
          <Route path="/pro" element={<ProtectedRoute allowedRole="team" isProRequired={true}><Outlet /></ProtectedRoute>}>
            <Route index element={<Navigate to="/pro/dashboard" />} />
            <Route path="dashboard" element={<ProDashboard />} />
            {/* Add more pro routes here later */}
          </Route>

          {/* Secret Admin Routes */}
          <Route path="/sys-admin-secret-login" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/sys-admin-secret-login/dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="teams/:id" element={<AdminTeamDetails />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="performance" element={<AdminPerformance />} />
            <Route path="revision-requests" element={<AdminRevisions />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="moderators" element={<Moderators />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>


          {/* Team Routes */}
          <Route path="/team" element={<ProtectedRoute allowedRole="team"><TeamLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/team/dashboard" />} />
            <Route path="dashboard" element={<TeamDashboard />} />
            <Route path="events" element={<TeamEvents />} />
            <Route path="media" element={<TeamMedia />} />
            <Route path="performance" element={<TeamPerformance />} />
            <Route path="roster" element={<TeamRoster />} />
            <Route path="social" element={<TeamSocial />} />
            <Route path="revisions" element={<TeamRevisions />} />
            <Route path="notifications" element={<TeamNotifications />} />
            <Route path="recruitments" element={<TeamRecruitments />} />
            <Route path="scout" element={<ScoutPlayers />} />
            <Route path="support" element={<SupportStaff />} />
            <Route path="socials" element={<SocialsSettings />} />
            <Route path="strategy/maps" element={<Maps />} />
            <Route path="strategy/video-analysis" element={<VideoAnalysis />} />
            <Route path="strategy/rotations" element={<Rotations />} />
            <Route path="strategy/drops" element={<TeamDrops />} />
          </Route>

          {/* Player Routes */}
          <Route path="/player" element={<ProtectedRoute allowedRole="player"><PlayerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/player/dashboard" />} />
            <Route path="dashboard" element={<PlayerDashboard />} />
            <Route path="browse-teams" element={<BrowseTeams />} />
            <Route path="teams/:id" element={<TeamProfile />} />
            <Route path="requests" element={<PlayerRequests />} />
            <Route path="matches" element={<PlayerMatches />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
