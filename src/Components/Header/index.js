import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import CompanyLogo from "./../../Images/Header/NICOCompany.svg";
import NotificationIcon from "./../../Images/Header/notifications.svg";
import UserProfile from "./../../Images/Header/Avatar.svg";

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/edit-profile"); // Navigate to the Edit Profile page
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src={CompanyLogo} alt="NICO Logo" />
      </div>
      <div className="header-right">
        <img src={NotificationIcon} alt="Notifications" className="notification-icon" />
        <div className="user-info" onClick={handleProfileClick}>
          <img src={UserProfile} alt="User" className="user-icon" />
          <div className="user-details">
            <span className="user-name">Person 1</span>
            <span className="user-company">Company A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
