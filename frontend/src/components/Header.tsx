import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = (): JSX.Element => {
  const location = useLocation();
  
  return (
    <header className="w-full h-[69px] bg-[#111827f2] border-b border-gray-800 fixed top-0 z-10">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="font-bold text-2xl">
            <span className="text-gray-100">EduRec</span>
            <span className="text-cyan-400">.</span>
          </Link>
          <nav className="flex space-x-6">
            <Link 
              to="/home" 
              className={`${location.pathname === '/home' ? 'text-gray-100' : 'text-gray-400'} hover:text-gray-100 transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`${location.pathname === '/about' ? 'text-gray-100' : 'text-gray-400'} hover:text-gray-100 transition-colors`}
            >
              About
            </Link>
            <Link 
              to="/settings" 
              className={`${location.pathname === '/settings' ? 'text-gray-100' : 'text-gray-400'} hover:text-gray-100 transition-colors`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
