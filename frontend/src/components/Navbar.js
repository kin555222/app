import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navigationLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/resources', label: 'Resources', icon: '📚' },
    { path: '/emergency', label: 'Emergency', icon: '🚨' },
  ];

  return (
    <>
      <nav className="bg-gradient-primary text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold hover:text-blue-200 transition-colors"
              onClick={closeMobileMenu}
            >
              <span className="text-2xl">🚨</span>
              <span className="hidden sm:inline">Disaster Prep</span>
              <span className="sm:hidden">Emergency</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link ${
                    isActivePath(path) ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <span className="mr-1">{icon}</span>
                  {label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className={`nav-link ${
                    isActivePath('/profile') ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <span className="mr-1">👤</span>
                  Profile
                </Link>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-blue-100">
                    👋 {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-emergency text-sm py-2 px-4"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center px-3 py-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
            onClick={closeMobileMenu}
          />
          
          {/* Menu */}
          <div className="mobile-menu animate-slide-up md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map(({ path, label, icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`mobile-menu-link ${
                    isActivePath(path) ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : ''
                  }`}
                  onClick={closeMobileMenu}
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className={`mobile-menu-link ${
                    isActivePath('/profile') ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : ''
                  }`}
                  onClick={closeMobileMenu}
                >
                  <span className="mr-2">👤</span>
                  Profile
                </Link>
              )}
            </div>
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4 pb-3">
              {isAuthenticated ? (
                <div className="px-4">
                  <div className="flex items-center mb-3">
                    <div className="text-base font-medium text-gray-800">
                      👋 Welcome, {user?.username}!
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-emergency w-full justify-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link
                    to="/login"
                    className="btn-secondary w-full justify-center"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary w-full justify-center"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
