import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, MessageSquareIcon } from 'lucide-react';

export const Header = (): JSX.Element => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="w-full h-[69px] bg-primary/90 border-b border-border fixed top-0 z-10">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="font-bold text-2xl">
            <span className="text-primary-foreground">EduRec</span>
            <span className="text-cyan-400">.</span>
          </Link>
          <nav className="flex space-x-6">
            <Link 
              to="/home" 
              className={`${location.pathname === '/home' ? 'text-primary-foreground' : 'text-muted-foreground'} hover:text-primary-foreground transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`${location.pathname === '/about' ? 'text-primary-foreground' : 'text-muted-foreground'} hover:text-primary-foreground transition-colors`}
            >
              About
            </Link>
            <Link 
              to="/settings" 
              className={`${location.pathname === '/settings' ? 'text-primary-foreground' : 'text-muted-foreground'} hover:text-primary-foreground transition-colors`}
            >
              Settings
            </Link>
            {location.pathname !== '/dashboard' && (
              <Link 
                to="/dashboard" 
                className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <MessageSquareIcon className="h-4 w-4 mr-1" />
                <span>Chat</span>
              </Link>
            )}
          </nav>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5 text-primary-foreground" />
          ) : (
            <MoonIcon className="h-5 w-5 text-primary-foreground" />
          )}
        </button>
      </div>
    </header>
  );
};
