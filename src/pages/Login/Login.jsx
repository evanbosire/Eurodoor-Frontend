import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";

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

const base_url = "https://eurodoor-backend.onrender.com";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) {
          toast.error("Email is required");
          return false;
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        return true;

      case "password":
        if (!value) {
          toast.error("Password is required");
          return false;
        }
        if (value.length < 4) {
          toast.error("Password must be at least 4 characters long");
          return false;
        }
        if (value.length > 6) {
          toast.error("Password cannot exceed 6 characters");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const validateForm = () => {
    return (
      validateField("email", formData.email) &&
      validateField("password", formData.password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `${base_url}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => {
            sessionStorage.setItem("email", formData.email);
            navigate("/dashboard");
          },
        });
      } else {
        const data = await response.json();
        toast.error(data.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    }
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <EurodoorLogo className="login-logo" />
            <h1>Login</h1>
          </div>
          <p className="subtitle">Welcome back administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              className="form-input"
            />
            <div className="input-highlight"></div>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Password (4-6 characters)"
              className="form-input"
            />
            <div className="input-highlight"></div>
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>

          <div className="login-link">
            Don't have an account?
            <Link to="/register" className="link">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;