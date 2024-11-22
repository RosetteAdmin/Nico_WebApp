import React, { useState } from "react";
import LoginScreen from "./Components/LoginScreen";
import Header from "./Components/Header";
import SideNavBar from "./Components/SideNavBar";
import HomeDashboard from "./Components/HomeDashboard"; // Import the HomeDashboard component
import DeviceDashboard from "./Components/DeviceDashboard"; // Import the DeviceDashboard component
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to handle login status
  const [selectedContent, setSelectedContent] = useState("dashboard"); // State to manage selected content (dashboard by default)

  // Simulate login action for demonstration purposes
  const handleLogin = () => {
    setIsLoggedIn(true); // Set logged-in state to true
  };

  // Handle menu item click to update the displayed content
  const handleMenuClick = (menuOption) => {
    setSelectedContent(menuOption); // Update the selected content based on menu option
  };

  // Render content dynamically based on the selected menu option
  const renderContent = () => {
    switch (selectedContent) {
      case "dashboard":
        return <HomeDashboard />; // Render the HomeDashboard for the default dashboard view
      case "Registered Devices":
        return <DeviceDashboard />; // Render the DeviceDashboard component for "Registered Devices"
      case "Add New Device":
        return <h1>Add New Device</h1>; // Placeholder for adding a new device
      case "Registered Users":
        return <h1>Registered Users</h1>; // Placeholder for users section
      case "Add New User":
        return <h1>Add New User</h1>; // Placeholder for users section
      case "Other 1":
        return <h1>Other 1</h1>; // Placeholder for other content
      case "Other 2":
        return <h1>Other 2</h1>; // Placeholder for other content
      default:
        return <h1>Welcome to the Dashboard</h1>; // Default fallback content
    }
  };

  return (
    <div className="app-container">
      {isLoggedIn ? (
        // Render the Dashboard Layout (Header + SideNavBar)
        <>
          <Header />
          <div className="main-content">
            <SideNavBar onMenuClick={handleMenuClick} />
            <div className="content-area">
              {/* Render dynamic content based on the selected menu */}
              {renderContent()}
            </div>
          </div>
        </>
      ) : (
        // Render the Login Screen
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
