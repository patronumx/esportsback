import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/60 group-hover:-translate-y-0.5 transition-all">
              <span className="text-xl font-bold">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight group-hover:text-violet-200 transition-colors">
                Patronum Esports
              </span>
              <span className="text-[10px] text-violet-400 font-medium tracking-wider uppercase">
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

            {/* Events Dropdown */}
            <div
              className="relative group/dropdown"
              onMouseEnter={() => setEventsDropdownOpen(true)}
              onMouseLeave={() => setEventsDropdownOpen(false)}
            >
              <button
                type="button"
                className={`text-base font-medium transition-all hover:text-violet-300 relative flex items-center ${location.pathname.startsWith('/events') ? 'text-violet-400' : 'text-slate-300'
                  }`}
              >
                Events
                <svg
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${eventsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ${location.pathname.startsWith('/events') ? 'w-full' : 'w-0 group-hover/dropdown:w-full'
                    }`}
                ></span>
              </button>
              {eventsDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-max">
                  <div className="bg-brand-card/98 backdrop-blur-xl shadow-xl rounded-lg py-2 z-50 min-w-[180px] border border-violet-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
                    {eventDropdownLinks.map((subLink) => (
                      <Link
                        key={subLink.to}
                        to={subLink.to}
                        className={`block px-5 py-3 text-sm hover:bg-violet-600/20 hover:text-violet-200 transition-colors ${location.pathname === subLink.to
                          ? 'text-violet-300 bg-violet-900/30'
                          : 'text-slate-300'
                          }`}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
            <Link
              to="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 hover:-translate-y-0.5"
            >
              Dashboard
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
            <div>
              <button
                type="button"
                className={`w-full flex justify-between items-center py-2 text-base font-medium transition-colors ${location.pathname.startsWith('/events')
                  ? 'text-violet-400'
                  : 'text-slate-300 hover:text-violet-400'
                  }`}
                onClick={() => setMobileEventsDropdownOpen((v) => !v)}
              >
                <span>Events</span>
                <svg
                  className={`ml-2 w-4 h-4 transition-transform ${mobileEventsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileEventsDropdownOpen && (
                <div className="pl-5 py-1 flex flex-col gap-1">
                  {eventDropdownLinks.map((subLink) => (
                    <Link
                      key={subLink.to}
                      to={subLink.to}
                      className={`block py-2 text-base font-medium transition-colors ${location.pathname === subLink.to
                        ? 'text-violet-400'
                        : 'text-slate-300 hover:text-violet-400'
                        }`}
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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
            <Link
              to="/login"
              className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full text-center font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all mt-4"
            >
              Dashboard Login
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
