import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, User as UserIcon, Sparkles, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="logo">
          ResumeCraft
        </Link>
      </div>

      {/* Hamburger Toggle Button (Mobile) */}
      <button 
        className="mobile-menu-btn" 
        onClick={toggleMobileMenu} 
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Nav Links Container (Desktop & Mobile Drawer) */}
      <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/about" className="nav-link">About</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link nav-icon-link">
              <FileText size={16} />
              <span>Dashboard</span>
            </Link>
            <Link to="/profile" className="nav-link nav-icon-link">
              <UserIcon size={16} />
              <span>Profile</span>
            </Link>
            <Link to="/upgrade" className="nav-link nav-icon-link premium-link">
              <Sparkles size={16} />
              <span>Premium</span>
            </Link>
            <div className="user-badge">
              {user?.profileImageUrl && (
                <img src={user.profileImageUrl} alt="avatar" className="user-avatar" />
              )}
              <span className="user-name">{user?.name}</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="btn btn-secondary logout-btn"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary get-started-btn">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
