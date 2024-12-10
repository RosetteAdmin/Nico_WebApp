import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginScreen from "./Components/LoginScreen";
import Header from "./Components/Header";
import SideNavBar from "./Components/SideNavBar";
import HomeDashboard from "./Components/HomeDashboard";
import DeviceDashboard from "./Components/DeviceDashboard";
import DeviceDetails from "./Components/DeviceDetails";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Handle login status

  // Simulate login for demonstration
  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn ? (
          <>
            <Header />
            <div className="main-content">
              <SideNavBar />
              <div className="content-area">
                {/* Define routes to different components */}
                <Routes>
                  <Route path="/" element={<HomeDashboard />} />
                  <Route path="/devices" element={<DeviceDashboard />} />
                  <Route path="/add-device" element={<h1>Add New Device</h1>} />
                  <Route path="/users" element={<h1>Registered Users</h1>} />
                  <Route path="/add-user" element={<h1>Add New User</h1>} />
                  <Route path="/other1" element={<h1>Other 1</h1>} />
                  <Route path="/other2" element={<h1>Other 2</h1>} />
               
                  <Route path="/device/:id" element={<DeviceDetails />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
