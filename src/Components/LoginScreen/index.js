import React, { useState } from "react";
import "./LoginScreen.css";
import NICOCompany from "./../../Images/LoginScreen/NICOCompany.svg";
import BottomDesign from "./../../Images/LoginScreen/bottomdesign.svg";
import CloseEye from "./../../Images/LoginScreen/CloseEye.svg";  // Eye icon for password not visible
import OpenEye from "./../../Images/LoginScreen/OpenEye.svg";  // Eye icon for password visible

function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="login-page">
      <div className="logo">
        <img src={NICOCompany} alt="NICO Logo" />
      </div>
      <h2>Login Now</h2>
      <p>*Login to Admin Dashboard is only for Company Authorized Associates</p>
      <form className="login-form">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Enter your email" />
        
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            type={passwordVisible ? "text" : "password"} // Toggle between password and text
            id="password"
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {/* Eye SVG icon */}
            <img
              src={passwordVisible ? OpenEye : CloseEye}  // Use the appropriate icon based on visibility
              alt="Toggle Visibility"
              className={passwordVisible ? "open-eye" : "closed-eye"}
            />
          </button>
        </div>
        
        <div className="options">
          <div className="remember-me">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        
        <button type="submit" className="login-button">Login</button>
      </form>
      {/* Bottom SVG Design */}
      <div className="bottom-design">
        <img src={BottomDesign} alt="Bottom Design" />
      </div>
    </div>
  );
}

export default LoginScreen;
