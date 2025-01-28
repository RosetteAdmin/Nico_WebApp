import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginScreen from "./Components/LoginScreen";
import Header from "./Components/Header";
import SideNavBar from "./Components/SideNavBar";
import HomeDashboard from "./Components/HomeDashboard";
import DeviceDashboard from "./Components/DeviceDashboard";
import DeviceDetails from "./Components/DeviceDetails";
import AddNewDevice from "./Components/AddNewDevice";
import ChangeProfile from "./Components/ChangeProfile";
import AccessManagement from "./Components/AccessManagement";
import RegisteredCompany from "./Components/RegisteredCompany";
import VendorsCompany from "./Components/VendorsCompany";
import "./App.css";

function App() {
  // Initialize isLoggedIn directly based on localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return !!user; // Return true if a user is found, otherwise false
  });

  const handleLogin = () => {
    setIsLoggedIn(true); 
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false); // Update state to logged out
  };

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn ? (
          <>
            {/* Dashboard Layout */}
            <Header  />
            <div className="main-content">
              <SideNavBar />
              <div className="content-area">
                <Routes>
                  <Route path="/dashboard" element={<HomeDashboard />} />
                  <Route path="/devices" element={<DeviceDashboard />} />
                  <Route path="/device/:id" element={<DeviceDetails />} />
                  <Route path="/add-device" element={<AddNewDevice />} />
                  <Route path="/access-management" element={<AccessManagement />} />
                  <Route path="/caccess" element={<RegisteredCompany />} />
                  <Route path="/vaccess" element={<VendorsCompany />} />
                  <Route path="/profile" element={<ChangeProfile onLogout={handleLogout}/>} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          // Login Screen
          <Routes>
            <Route path="/login" element={<LoginScreen handleLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
