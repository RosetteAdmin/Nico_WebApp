import React, { useState } from "react";
import LoginScreen from "./Components/LoginScreen";
import Header from "./Components/Header";
import SideNavBar from "./Components/SideNavBar";
import HomeDashboard from "./Components/HomeDashboard"; // Import the HomeDashboard component
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
        return <HomeDashboard />;
      case "devices":
        return <h1>Devices Content</h1>; // Placeholder for devices section
      case "users":
        return <h1>Users Content</h1>; // Placeholder for users section
      case "others":
        return <h1>Others Content</h1>; // Placeholder for other content
      default:
        return <h1>Welcome to the Dashboard</h1>;
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
