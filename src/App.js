import React, { useState } from "react";
import "./App.css"; // Import the CSS file
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [checkboxError, setCheckboxError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  const validateEmail = (email) => email.includes("@");

  const handleVerifyOtp = () => {
  console.log("OTP Verified for", email);
  setShowSuccessPopup(true);  // Show the success card
};


  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleGenerateOtp = () => {
    let valid = true;

    if (!email) {
      setEmailError("Please enter Email");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email with '@'");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter password");
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long and contain letters and numbers");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!isChecked) {
      setCheckboxError("You must agree to the terms of use");
      valid = false;
    } else {
      setCheckboxError("");
    }

    if (valid) {
      console.log("OTP Generated for", email);
      setShowOtpSection(true);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError("");
    if (!newPassword) {
      setPasswordStrength("");
    } else if (validatePassword(newPassword)) {
      setPasswordStrength("Strong password");
    } else {
      setPasswordStrength("Weak password - must contain at least 6 characters, letters, and numbers");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setCheckboxError("");
  };

  return (
    <div className="container">
      <div className="left-section">
        
      </div>

      <div className="right-section">
        <h1>Log In</h1>
        <p className="note">Note: This page is dedicated only for Governing Members of NICO Nanobubbles India Co.</p>

        <div className="form-container">
          <label>Email</label>
          <input type="email" className="input-field" value={email} onChange={handleEmailChange} />
          {emailError && <p className="error-message">{emailError}</p>}

          <label>Password</label>
          <input type="password" className="input-field" value={password} onChange={handlePasswordChange} />
          {passwordError && <p className="error-message">{passwordError}</p>}
          {passwordStrength && <p className={`password-strength ${validatePassword(password) ? "strong" : "weak"}`}>{passwordStrength}</p>}

          <div className="checkbox-container">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            <label>I agree with the terms of use</label>
          </div>
          {checkboxError && <p className="error-message">{checkboxError}</p>}

          <button className="btn" onClick={handleGenerateOtp}>Generate OTP</button>

          {showOtpSection && (
            <>
              <p><b> Enter OTP received to Above Email ID</b></p>
              <input type="text" className="input-field" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button className="btn" onClick={handleVerifyOtp}>Verify OTP and Login</button>
            </>
          )}
        </div>
      </div>
      {showSuccessPopup && (
      <div className="overlay">
        <div className="popup-card">
          <div className="icon">
              <i className="fa fa-check-circle" aria-hidden="true"></i>
          </div>
          <h2>Log In Successful</h2>
          <p>You are Logging In as<br /><strong>Company Associate</strong></p>
          <button className="btn">
            Continue
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default App;



