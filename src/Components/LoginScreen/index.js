import React, { useState } from "react";
import "./LoginScreen.css";
import NICOCompany from "./../../Images/LoginScreen/NICOCompany.svg";
import BottomDesign from "./../../Images/LoginScreen/bottomdesign.svg";
import CloseEye from "./../../Images/LoginScreen/CloseEye.svg"; // Eye icon for hidden password
import OpenEye from "./../../Images/LoginScreen/OpenEye.svg";  // Eye icon for visible password

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev); // Toggle password visibility state
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    if (email && password) {
      console.log("Logged in with email:", email); // Debug log
      onLogin(); // Call the `onLogin` function passed via props
    } else {
      alert("Please enter both email and password!"); // Alert for incomplete input
    }
  };

  return (
    <div className="login-page">
      {/* Company Logo */}
      <div className="logo">
        <img src={NICOCompany} alt="NICO Logo" />
      </div>

      {/* Title and Info */}
      <h2>Login Now</h2>
      <p>*Login to Admin Dashboard is only for Company Authorized Associates</p>

      {/* Login Form */}
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Email Input */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          required
        />

        {/* Password Input */}
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            type={passwordVisible ? "text" : "password"} // Toggle between text and password
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {/* Dynamically change the password visibility icon */}
            <img
              src={passwordVisible ? OpenEye : CloseEye}
              alt={passwordVisible ? "Hide Password" : "Show Password"}
              className="eye-icon"
            />
          </button>
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="options">
          <div className="remember-me">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        {/* Login Button */}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      {/* Bottom Decorative Design */}
      <div className="bottom-design">
        <img src={BottomDesign} alt="Bottom Design" />
      </div>
    </div>
  );
}

export default LoginScreen;
