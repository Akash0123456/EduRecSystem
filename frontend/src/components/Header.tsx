import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOutIcon } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const Header = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
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
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-gray-100 hover:bg-gray-800 flex items-center gap-2"
          onClick={handleLogout}
        >
          <span>Log out</span>
          <LogOutIcon className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
