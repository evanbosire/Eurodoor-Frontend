import React, { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import "./navbar.scss";
import { useNavigate } from "react-router-dom";

const EurodoorLogo = ({ className }) => (
  <svg 
    className={className}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 300 100" 
    width="120" 
    height="40"
  >
    <defs>
      <linearGradient id="doorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#6366f1", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#4338ca", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="euroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#fbbf24", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#f59e0b", stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Door icon */}
    <g transform="translate(20, 15)">
      {/* Door frame */}
      <rect x="0" y="0" width="40" height="70" rx="4" fill="url(#doorGradient)" stroke="#4338ca" strokeWidth="2"/>
      {/* Door handle */}
      <circle cx="32" cy="35" r="3" fill="#fbbf24"/>
      {/* Door panels */}
      <rect x="4" y="8" width="32" height="24" rx="2" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.7"/>
      <rect x="4" y="38" width="32" height="24" rx="2" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.7"/>
      {/* Euro stars accent */}
      <g fill="#fbbf24" opacity="0.8">
        <polygon points="10,18 11,21 14,21 11.5,23 12.5,26 10,24 7.5,26 8.5,23 6,21 9,21" transform="scale(0.4)"/>
        <polygon points="10,48 11,51 14,51 11.5,53 12.5,56 10,54 7.5,56 8.5,53 6,51 9,51" transform="scale(0.3)"/>
      </g>
    </g>
    
    {/* Text */}
    <g transform="translate(80, 35)">
      {/* EURO text */}
      <text x="0" y="20" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="url(#euroGradient)">EURO</text>
      {/* DOOR text */}
      <text x="0" y="50" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="url(#doorGradient)">DOOR</text>
    </g>
    
    {/* Subtle accent line */}
    <line x1="80" y1="58" x2="220" y2="58" stroke="#e5e7eb" strokeWidth="1"/>
  </svg>
);

const Navbar = ({ toggleSidebar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleMenuClick = () => {
    if (window.innerWidth <= 480) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
    toggleSidebar();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Left section with menu icon */}
          <div className="navbar-left">
            <button onClick={handleMenuClick} className="menu-button">
              <Menu className="menu-icon" />
            </button>
          </div>

          {/* Center section with Eurodoor logo and text */}
          <div className="navbar-center">
            <div className="logo-container">
              <EurodoorLogo className="eurodoor-logo" />
            </div>
            <div className="logo-text">
              <span className="company-name">EURODOOR</span>
              <span className="dashboard-label">ADMINISTRATOR DASHBOARD</span>
            </div>
          </div>

          {/* Right section with logout button */}
          <div className="navbar-right">
            <button
              onClick={handleLogout}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`logout-button ${isHovered ? "hovered" : ""}`}
            >
              <LogOut className="logout-icon" />
              <span className="logout-text">Logout</span>
            </button>
          </div>

          {/* Mobile Menu - Only shown on small screens */}
          {window.innerWidth <= 480 && isMobileMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-content">
                <button onClick={handleLogout} className="mobile-logout-button">
                  <LogOut className="logout-icon" />
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;