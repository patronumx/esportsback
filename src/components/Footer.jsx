import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="border-t border-violet-500/20 bg-brand-card/50 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Patronum Esports" className="w-10 h-10 rounded-lg object-contain" />
              <span className="text-lg font-bold">Patronum Esports</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A next-generation esports organization redefining competition, innovation, and community in gaming.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-violet-400">Quick Links</h4>
            <div className="space-y-2">
              <Link
                to="/about"
                className="block text-sm text-slate-400 hover:text-violet-300 transition-colors"
              >
                About
              </Link>
              <Link
                to="/competitive-esports"
                className="block text-sm text-slate-400 hover:text-violet-300 transition-colors"
              >
                Teams
              </Link>
              <Link
                to="/creators-partners"
                className="block text-sm text-slate-400 hover:text-violet-300 transition-colors"
              >
                Creators
              </Link>
              <Link
                to="/media-coverage"
                className="block text-sm text-slate-400 hover:text-violet-300 transition-colors"
              >
                Media
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-violet-400">Contact</h4>
            <a
              href="mailto:business@patronumesports.com"
              className="text-sm text-slate-400 hover:text-violet-300 transition-colors block mb-4"
            >
              business@patronumesports.com
            </a>

            <div className="flex gap-3">
              {/* X (Twitter) */}
              <a
                href="https://x.com/PatronumGG"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Patronum Esports on X"
                className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center hover:bg-violet-500/30 hover:-translate-y-0.5 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4L10.5 13.5L4.5 20H7.5L12.1 14.9L16 20H20L13.3 10.3L19 4H16L11.7 8.9L8.2 4H4Z"
                    fill="white"
                  />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@patronumgg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Patronum Esports on YouTube"
                className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center hover:bg-violet-500/30 hover:-translate-y-0.5 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3" y="6" width="18" height="12" rx="3" fill="white" />
                  <polygon points="10,9 16,12 10,15" fill="#000000" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61584268109137"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Patronum Esports on Facebook"
                className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center hover:bg-violet-500/30 hover:-translate-y-0.5 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 8H15V5H13.2C10.8 5 9.5 6.3 9.5 8.7V10.5H8V13H9.5V19H12.5V13H14.5L15 10.5H12.5V8.8C12.5 8.3 12.8 8 13.5 8Z"
                    fill="white"
                  />
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/3jmaDzSs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Patronum Esports Discord"
                className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center hover:bg-violet-500/30 hover:-translate-y-0.5 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 6C7.4 6.2 6.5 6.6 5.8 7L5.3 8.9C4.8 9.9 4.5 11 4.5 12.1C4.5 12.1 5.2 13.3 7.2 14L7.6 13.4C6.9 13.1 6.4 12.7 6.4 12.7C6.4 12.7 6.5 12.6 6.6 12.6C7.5 13.2 8.6 13.5 9.8 13.6H10.2C11.4 13.5 12.5 13.2 13.4 12.6C13.5 12.6 13.6 12.7 13.6 12.7C13.6 12.7 13.1 13.1 12.4 13.4L12.8 14C14.8 13.3 15.5 12.1 15.5 12.1C15.5 11 15.2 9.9 14.7 8.9L14.2 7C13.5 6.6 12.6 6.2 11.5 6.1L11.1 6.6C10.4 6.5 9.6 6.5 8.9 6.6L8.5 6ZM9.2 11.5C8.7 11.5 8.3 11.1 8.3 10.6C8.3 10.1 8.7 9.7 9.2 9.7C9.7 9.7 10.1 10.1 10.1 10.6C10.1 11.1 9.7 11.5 9.2 11.5ZM12.8 11.5C12.3 11.5 11.9 11.1 11.9 10.6C11.9 10.1 12.3 9.7 12.8 9.7C13.3 9.7 13.7 10.1 13.7 10.6C13.7 11.1 13.3 11.5 12.8 11.5Z"
                    fill="white"
                  />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@patronum_gg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Patronum Esports on TikTok"
                className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center hover:bg-violet-500/30 hover:-translate-y-0.5 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5 5.5C15.1 6.5 16 7.3 17.1 7.7V9.6C15.9 9.5 14.9 9.1 14 8.5V12.7C14 15 12.4 16.6 10.1 16.6C8.1 16.6 6.5 15.2 6.5 13.2C6.5 11.2 8 9.8 10.1 9.8C10.4 9.8 10.7 9.8 11 9.9V11.7C10.8 11.6 10.5 11.6 10.3 11.6C9.3 11.6 8.6 12.2 8.6 13.2C8.6 14.2 9.3 14.8 10.2 14.8C11.3 14.8 12 14.1 12 12.9V4.5H14.5V5.5Z"
                    fill="white"
                  />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/patronum_gg/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Patronum Esports on Instagram"
                className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center hover:bg-violet-500/30 hover:-translate-y-0.5 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="4"
                    stroke="white"
                    strokeWidth="1.6"
                  />
                  <circle cx="12" cy="12" r="3.2" stroke="white" strokeWidth="1.6" />
                  <circle cx="16.2" cy="7.8" r="0.9" fill="white" />
                </svg>
              </a>

              {/* Twitch */}
              <a
                href="https://www.twitch.tv/patronum_gg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Patronum Esports on Twitch"
                className="w-9 h-9 bg-violet-500/10 rounded-lg flex items-center justify-center hover:bg-violet-500/30 hover:-translate-y-0.5 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>


          </div>
        </div>

        <div className="pt-8 border-t border-violet-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2025 Patronum Esports. All rights reserved.</p>
          <p className="text-xs text-slate-500">
            Powered by <span className="text-violet-400">PatronumX</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
