import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import LoginScreen from "./Components/LoginScreen";
import Header from "./Components/Header";
import SideNavBar from "./Components/SideNavBar";
import HomeDashboard from "./Components/HomeDashboard";
import DeviceDashboard from "./Components/DeviceDashboard";
import DeviceDetails from "./Components/DeviceDetails";
import EditProfile from "./Components/EditProfile";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    // Clear session and redirect to login
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn ? (
          <>
            {/* Dashboard Layout */}
            <Header onLogout={handleLogout} />
            <div className="main-content">
              <SideNavBar />
              <div className="content-area">
                <Routes>
                  <Route path="/dashboard" element={<HomeDashboard />} />
                  <Route path="/devices" element={<DeviceDashboard />} />
                  <Route path="/device/:id" element={<DeviceDetails />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          // Login Screen
          <Routes>
            <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
