import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const Navbar = () => {
  const { isAuthenticated, user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-white no-underline">
            EventHub
          </Link>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <Link to="/events" className="text-white no-underline hover:opacity-80 transition-opacity">
              Events
            </Link>
            {isAuthenticated ? (
              <>
                {isOrganizer ? (
                  <Link to="/organizer/dashboard" className="text-white no-underline hover:opacity-80 transition-opacity">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-white no-underline hover:opacity-80 transition-opacity">
                    My Events
                  </Link>
                )}
                <span className="text-white font-medium">Welcome, {user?.name}</span>
                <button 
                  onClick={handleLogout} 
                  className="px-5 py-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white no-underline hover:opacity-80 transition-opacity">
                  Login
                </Link>
                <Link to="/register" className="text-white no-underline hover:opacity-80 transition-opacity">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;