import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [mobileEventsDropdownOpen, setMobileEventsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setEventsDropdownOpen(false);
    setMobileEventsDropdownOpen(false);
  }, [location]);

  // Main nav links, omitting "Events" which will be handled separately for dropdown
  const navLinks = [
    { to: '/', label: 'Home' },
    // { to: '/competitive-esports', label: 'Competitive' },
    { to: '/creators-partners', label: 'Creators' },
    { to: '/brands', label: 'Brands' },
    { to: '/talent', label: 'Talent' },
    // { to: '/events', label: 'Events' }, // handled separately for dropdown
    { to: '/tech-anti-cheat', label: 'Technology' },
    // { to: '/faq', label: 'FAQ' },
    { to: '/about', label: 'About' },
  ];

  // Sub-links for Events dropdown
  const eventDropdownLinks = [
    { to: '/events/pmgc-2025', label: 'PMGC 2025' },
    // { to: '/events/pgc-2025', label: 'PGC 2025' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-brand-bg/95 backdrop-blur-xl border-b border-violet-500/20 shadow-lg shadow-violet-500/10'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Patronum Logo"
              className="w-14 h-14 mt-2 object-contain group-hover:-translate-y-0.5 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight group-hover:text-violet-200 transition-colors uppercase font-display">
                Patronum Esports
              </span>
              <span className="text-xs text-violet-400 font-bold tracking-[0.2em] uppercase">
                PatronumX Ecosystem
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium transition-all hover:text-violet-300 relative group ${location.pathname === link.to ? 'text-violet-400' : 'text-slate-300'
                  }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                ></span>
              </Link>
            ))}

            <Link
              to="/events/pmgc-2025"
              className={`text-base font-medium transition-all hover:text-violet-300 relative group ${location.pathname.startsWith('/events') ? 'text-violet-400' : 'text-slate-300'
                }`}
            >
              Events
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ${location.pathname.startsWith('/events') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
              ></span>
            </Link>

            {navLinks.slice(4).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-base font-medium transition-all hover:text-violet-300 relative group ${location.pathname === link.to ? 'text-violet-400' : 'text-slate-300'
                  }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                ></span>
              </Link>
            ))}
            {/* 
             <Link
              to="/team/login"
              className="text-base font-medium text-slate-300 hover:text-violet-300 transition-colors"
            >
              Team Login
            </Link> 
            */}

            <Link
              to="/pro/login"
              className="relative px-6 py-2.5 bg-gradient-to-r from-purple-900/60 to-violet-900/60 border border-purple-500/50 rounded-full text-sm font-semibold text-purple-100 hover:shadow-lg hover:shadow-purple-500/20 group overflow-hidden transition-all cursor-pointer flex items-center justify-center"
            >
              <span className="relative z-10">Pro Teams</span>
              <span className="absolute inset-0 bg-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
          </div>


          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-violet-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-card/98 backdrop-blur-xl border-t border-violet-500/20">
          <div className="px-6 py-6 space-y-4">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 text-base font-medium transition-colors ${location.pathname === link.to ? 'text-violet-400' : 'text-slate-300 hover:text-violet-400'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Events Mobile Dropdown */}
            <Link
              to="/events/pmgc-2025"
              className={`block py-2 text-base font-medium transition-colors ${location.pathname.startsWith('/events')
                ? 'text-violet-400'
                : 'text-slate-300 hover:text-violet-400'
                }`}
            >
              Events
            </Link>

            {navLinks.slice(4).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 text-base font-medium transition-colors ${location.pathname === link.to
                  ? 'text-violet-400'
                  : 'text-slate-300 hover:text-violet-400'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {/* 
            <Link
              to="/team/login"
              className="block w-full text-center py-2 text-base font-medium text-slate-300 hover:text-violet-400"
            >
              Team Login
            </Link> 
            */}
            <Link
              to="/pro/login"
              className="block w-full px-6 py-3 bg-gradient-to-r from-purple-900/60 to-violet-900/60 border border-purple-500/50 rounded-full text-center font-semibold text-purple-100 mt-2 hover:bg-purple-800/50 transition-all group relative overflow-hidden"
            >
              <span className="relative z-10">Pro Teams</span>
              <span className="absolute inset-0 bg-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
            <Link
              to="/join-us"
              className="block w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-center font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all"
            >
              Join Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
