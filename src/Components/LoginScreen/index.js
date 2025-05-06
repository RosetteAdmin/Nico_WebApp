import React, { useState } from "react";
import "./LoginScreen.css";
import NICOCompany from "./../../Images/LoginScreen/NICOCompany.svg";
import BottomDesign from "./../../Images/LoginScreen/bottomdesign.svg";
import Confirm from "./../../Images/LoginScreen/Confirmation.svg";
import CloseEye from "./../../Images/LoginScreen/CloseEye.svg"; // Eye icon for hidden password
import OpenEye from "./../../Images/LoginScreen/OpenEye.svg";  // Eye icon for visible password
import { useNavigate } from "react-router-dom";

const LoginScreen = ({ handleLogin }) => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State to track loading
  const [error, setError] = useState(""); // State to track error messages
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login confirmation
  const [role, setRole] = useState(""); // State to store user role
  const [user, setUser] = useState(null); // State to store user data

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev); // Toggle password visibility state
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    if (email && password) {
      setLoading(true); // Show loading spinner
      setError(""); // Reset error state before making the request

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
    
        console.log(response);
    
        const data = await response.json(); // Assuming the server responds with JSON
        console.log("Data:", data.user); // Log the data object
    
        if (response.ok && email === data.user.email && password === data.user.password) {
            console.log("Logged in successfully:", data);
    
            // Extract the role property
            const userRole = data.user.role;
            console.log("User Role:", userRole);
    
            // Store token or user data in local storage
            if (data) {
                localStorage.setItem("authToken", data.token); // Store the token
                localStorage.setItem("user", JSON.stringify(data.user)); // Optionally store user data
            }
            setRole(userRole); // Set the role state
            setIsLoggedIn(true); // Confirm login
            setUser(true);
        } else {
            setError(data.message || "Login failed. Please check your credentials.");
            setUser(false);
            setIsLoggedIn(true); // Confirm login
        }
    } catch (error) {
        setError("An error occurred. Please try again later.");
        console.error("Error during login:", error);
    } finally {
        setLoading(false); // Hide loading spinner
    }
    } else {
      alert("Please enter both email and password!"); // Alert for incomplete input
    }
  };

  const handleContinue = () => {
    handleLogin(); // Update the parent component's state 
    navigate("/dashboard"); // Redirect to the dashboard
  };

  const handleLoginAgain = () => {
    setIsLoggedIn(false);
    setUser(null);
    setEmail("");
    setPassword("");
    setError("");
    setRole("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    };

  return (
    <div className="login-page">
      <div className="logo">
        <img src={NICOCompany} alt="NICO Logo" />
      </div>
      {isLoggedIn && user ? (
        <div className="confirmation-view">
          <div className="confirmation-content">
            <div className="confirm-icon">
              <img src={Confirm} alt="Confirmation Icon" />
            </div>
            <h2>Login Successful</h2>
            <p>You are logging in as:</p>
            <p>{role}</p> {/* Display the role */}
            <button onClick={handleContinue} className="continue-button">
              Continue
            </button>
          </div>
          {/* <button onClick={handleLoginAgain} className="login-again-button">
            Login
          </button> */}
        </div>
      ) : isLoggedIn && !user ? (
        <div className="confirmation-view">
          <div className="confirmation-content">
            <h2>Invalid User</h2>
            <p>The user does not exist in the database.</p>
            <button onClick={handleLoginAgain} className="login-again-button">
              Login
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Title and Info */}
          <h2>Login Now</h2>
          <p>*Login to Admin Dashboard is only for Company Authorized Associates</p>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

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
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
        </>
      )}
      <div className="bottom-design">
        <img src={BottomDesign} alt="Bottom Design" />
      </div>
    </div>
  );
};

export default LoginScreen;