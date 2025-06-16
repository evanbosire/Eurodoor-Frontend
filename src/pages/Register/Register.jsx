import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.scss";
import axios from "axios";

const base_url = "https://eurodoor-backend.onrender.com";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        // Name is optional, but if provided, validate format
        if (value.trim() && !/^[a-zA-Z\s]+$/.test(value)) {
          toast.error("Full name should contain only letters");
          return false;
        }
        return true;

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

      case "phone":
        if (!value) {
          toast.error("Phone number is required");
          return false;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          toast.error("Phone number must be exactly 10 digits");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const validateForm = () => {
    let isValid = true;

    const validations = [
      { field: "email", value: formData.email },
      { field: "password", value: formData.password },
      { field: "phone", value: formData.phone },
    ];

    // Name is optional, so we don't validate it if empty
    if (formData.name.trim()) {
      validations.push({ field: "name", value: formData.name });
    }

    for (const validation of validations) {
      if (!validateField(validation.field, validation.value)) {
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${base_url}/api/admin/register`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Administrator account created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => navigate("/login"),
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Registration failed");
      } else if (err.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("Request error. Please try again.");
      }
    }
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  return (
    <div className="signup-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="signup-card">
        <div className="signup-header">
          <div className="logo-container">
            <div className="logo-circle"></div>
            <h1>Create Account</h1>
          </div>
          <p className="subtitle">Register your administrator profile</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Full Name (optional, letters only)"
              className="form-input"
            />
            <div className="input-highlight"></div>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email Address (example@domain.com)"
              className="form-input"
              required
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
              required
            />
            <div className="input-highlight"></div>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Phone Number (10 digits)"
              className="form-input"
              required
            />
            <div className="input-highlight"></div>
          </div>

          <button type="submit" className="submit-btn">
            Register Account
          </button>

          <div className="login-link">
            Already have an account?
            <a href="/login" className="link">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;