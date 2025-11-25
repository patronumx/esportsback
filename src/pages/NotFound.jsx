import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold mb-4">This chapter does not exist.</h1>
        <p className="text-slate-400 mb-8">The page you&apos;re looking for couldn&apos;t be found.</p>
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full font-semibold hover:shadow-xl hover:shadow-violet-500/50 transition-all hover:scale-105 hover:-translate-y-0.5"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
