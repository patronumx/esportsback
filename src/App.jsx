import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Hyperspeed from './components/Hyperspeed';
import { hyperspeedPresets } from './components/hyperspeedPresets';

import Home from './pages/Home';
import About from './pages/About';
import CompetitiveEsports from './pages/CompetitiveEsports';
import CreatorsPartners from './pages/CreatorsPartners';
import TechAntiCheat from './pages/TechAntiCheat';
import MediaCoverage from './pages/MediaCoverage';
import JoinUs from './pages/JoinUs';
import FAQ from './pages/FAQ';
import Brands from './pages/Brands';
import PMGC2025 from './pages/events/PMGC2025';
import PGC2025 from './pages/events/PGC2025';
import TeamDetails from './pages/events/TeamDetails';
import NotFound from './pages/NotFound';
import Login from './pages/dashboard/Login';
import Dashboard from './pages/dashboard/Dashboard';

function AppContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-50 font-onest antialiased relative overflow-hidden">
      {/* Hyperspeed Background - Fixed and Behind All Content */}
      <div
        className="fixed inset-0 z-0 opacity-40"
        style={{ width: '100vw', height: '100vh' }}
      >
        <Hyperspeed effectOptions={hyperspeedPresets.five} />
      </div>

      {/* Main Content - Above Background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isDashboardRoute && <Navbar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/competitive-esports" element={<CompetitiveEsports />} />
            <Route path="/creators-partners" element={<CreatorsPartners />} />
            <Route path="/tech-anti-cheat" element={<TechAntiCheat />} />
            <Route path="/media-coverage" element={<MediaCoverage />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/events/pmgc-2025" element={<PMGC2025 />} />
            <Route path="/events/pmgc-2025/team/:teamId" element={<TeamDetails />} />
            <Route path="/events/pgc-2025" element={<PGC2025 />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isDashboardRoute && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
