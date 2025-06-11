import React, { useState } from "react";
import "./LoginScreen.css";
import NICOCompany from "./../../Images/LoginScreen/NICOCompany.svg";
import BottomDesign from "./../../Images/LoginScreen/bottomdesign.svg";
import CloseEye from "./../../Images/LoginScreen/CloseEye.svg";
import OpenEye from "./../../Images/LoginScreen/OpenEye.svg";
import nico from "./../../Images/LoginScreen/nico.svg";
import leftside from "./../../Images/LoginScreen/leftside.svg";


import { useNavigate } from "react-router-dom";

const LoginScreen = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [otpGenerated, setOtpGenerated] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      setError("");
      setErrorPopup(false);

      const headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      try {
        const bodyContent = JSON.stringify({ email, password });
        const response = await fetch(`${process.env.REACT_APP_EP}/data/getuser`, {
          method: "POST",
          body: bodyContent,
          headers: {
            "Content-Type": "application/json",
            ...headersList,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to validate email/password.`);
        }

        const data = await response.json();

        if (email === data.user.email && password === data.user.password) {
          const otpResponse = await fetch(`${process.env.REACT_APP_EP}/auth/otp`, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
              "Content-Type": "application/json",
              ...headersList,
            },
          });

          if (!otpResponse.ok) {
            const errorText = await otpResponse.text();
            throw new Error(`OTP generation failed.`) 
          //     Status: ${otpResponse.status}, Response: ${errorText}
          //     `);
          }

          const otpData = await otpResponse.json();
          if (otpResponse.ok) {
            setOtpGenerated(true);
            setUser(data.user);
            setRole(data.user.role);
          } else {
            setError(otpData.message || "Failed to send OTP. Please try again.");
            setErrorPopup(true);
            setOtpGenerated(false);
          }
        } else {
          setError(data.message || "Invalid email or password.");
          setErrorPopup(true);
          setOtpGenerated(false);
        }
      } catch (error) {
        setError(error.message || "An error occurred during login. Please try again later.");
        setErrorPopup(true);
        console.error("Error during login:", error);
        setOtpGenerated(false);
      }
    } else {
      setError("Please enter both email and password!");
      setErrorPopup(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpGenerated) {
      setError("Please generate an OTP first.");
      setErrorPopup(true);
      return;
    }

    if (!otp) {
      setError("Please enter the OTP.");
      setErrorPopup(true);
      return;
    }

    setError("");
    setErrorPopup(false);

    const headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
    };

    try {
      const verifyResponse = await fetch(`${process.env.REACT_APP_EP}/auth/verifyotp`, {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: {
          "Content-Type": "application/json",
          ...headersList,
        },
      });

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        throw new Error(`OTP verification failed.`);
        //  Status: ${verifyResponse.status}, Response: ${errorText}`);
      }

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok) {
        localStorage.setItem("authToken", verifyData.token || "mock-token");
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
      } else {
        setError(verifyData.message || "Invalid OTP. Please try again.");
        setErrorPopup(true);
        setIsLoggedIn(false);
      }
    } catch (error) {
      setError(error.message || "An error occurred during OTP verification. Please try again.");
      setErrorPopup(true);
      console.error("Error during OTP verification:", error);
    }
  };

  const handleContinue = () => {
    handleLogin();
    navigate("/dashboard");
  };

  const handleLoginAgain = () => {
    setIsLoggedIn(false);
    setUser(null);
    setEmail("");
    setPassword("");
    setOtp("");
    setError("");
    setErrorPopup(false);
    setRole("");
    setOtpGenerated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <div className="login-page">
      <div className="left-section">
        <img src={leftside} alt="NICO Logo" />
      </div>
      <div className="right-section">
      {isLoggedIn && user ? (
        
        <div className="confirmation-view">
          <div className="confirmation-content">
            <div className="confirm-icon">
              <i className="fa fa-check-circle" aria-hidden="true"></i>
            </div>
            <h2>Login Successful</h2>
            <p>You are logging in as:</p>
            <p>{role}</p>
            <button onClick={handleContinue} className="continue-button">
              Continue
            </button>
          </div>
        </div>
      ) : (isLoggedIn && !user) || errorPopup ? (
        <div className="confirmation-view">
          <div className="confirmation-content">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={handleLoginAgain} className="login-again-button">
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1>Log In </h1>
          <p className="note">Note: This page is dedicated only for Governing Members of NICO Nanububbles India Co.</p>

          {otpGenerated && !error && (
            <div className="success-message">
              OTP sent successfully. Please check your email.
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              className="input-field"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                className="input-field"
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                <img
                  src={passwordVisible ? OpenEye : CloseEye}
                  alt={passwordVisible ? "Hide Password" : "Show Password"}
                  className="eye-icon"
                />
              </button>
            </div>

            <div className="options">
              <div className="remember-me">
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">I agree with the terms of use</label>
              </div>
            </div>

            <button type="submit" className="login-button">
              Generate OTP
            </button>
            <div className="otp-label">
            <label style={{ display: "block", textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
              Enter OTP received to Above Email ID
            </label>
            </div>
            <input
              className="input-field"
              type="number"
              id="otp"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="login-again-button"
            >
              Verify OTP and Login
            </button>
          </form>
        </>
      )}
      {/* <div className="bottom-design">
        <img src={BottomDesign} alt="Bottom Design" />
      </div> */}
    </div>
    </div>
  );
};

export default LoginScreen;
