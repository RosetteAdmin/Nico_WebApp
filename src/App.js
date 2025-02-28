import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginScreen from "./Components/LoginScreen";
import Header from "./Components/Header";
import SideNavBar from "./Components/SideNavBar";
import HomeDashboard from "./Components/HomeDashboard";
import DeviceDashboard from "./Components/DeviceDashboard";
import PreRegDevices from "./Components/PreRegDevices";
import DeviceDetails from "./Components/DeviceDetails";
import AddNewDevice from "./Components/AddNewDevice";
import ChangeProfile from "./Components/ChangeProfile";
import AccessManagement from "./Components/AccessManagement";
import RegisteredCompany from "./Components/RegisteredCompany";
import VendorsCompany from "./Components/VendorsCompany";
import Userinfo from "./Components/Userinfo";
import Userinfovendor from "./Components/UserInfovendor";
import Customers from "./Components/Customers";
import ServiceRequestsAlerts from "./Components/ServiceRequestsAlerts";
import MaintenancePage from "./Components/NFM";
import AddVendors from "./Components/AddVendors";
import AddUsers from "./Components/AddUsers";
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
          <Routes>
            {/* Maintenance route separated from the dashboard layout */}
            <Route path="/maintenance" element={<MaintenancePage />} />
            
            {/* Dashboard Layout wrapped in a route */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <div className="main-content">
                    <SideNavBar />
                    <div className="content-area">
                      <Routes>
                        <Route path="/dashboard" element={<HomeDashboard />} />
                        <Route path="/devices" element={<DeviceDashboard />} />
                        <Route path="/PreRegDevices" element={<PreRegDevices />} />
                        <Route path="/device/:id" element={<DeviceDetails />} />
                        <Route path="/add-device" element={<AddNewDevice />} />
                        <Route path="/access-management" element={<AccessManagement />} />
                        <Route path="/caccess" element={<RegisteredCompany />} />
                        <Route path="/addusersinfo" element={<AddUsers/>} />      {/* Adding New Users */}
                        <Route path="/vaccess" element={<VendorsCompany />} />
                        <Route path="/addvendorsinfo" element={<AddVendors />} /> {/* Adding New Vendors */}
                        <Route path="/profile" element={<ChangeProfile onLogout={handleLogout} />} />
                        <Route path="/userinfo/:id" element={<Userinfo />} />
                        <Route path="/userinfovendor/:id" element={<Userinfovendor />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/service-requests" element={<ServiceRequestsAlerts />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="*" element={<Navigate to="/maintenance" />} />
                      </Routes>
                    </div>
                  </div>
                </>
              }
            />
          </Routes>
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
