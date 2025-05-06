import React from "react";
import "./Header.css";
// import { useNavigate } from "react-router-dom";
import CompanyLogo from "./../../Images/Header/NICOCompany.svg";
import NotificationIcon from "./../../Images/Header/notifications.svg";
import InfoIcon from "./../../Images/Header/infoOutline.svg";
import SearchIcon from "./../../Images/Header/SearchIcon.svg";

const Header = () => {
  // const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-logo">
        <img src={CompanyLogo} alt="NICO Logo" />
      </div>
      <div className="header-right">
        <div className="search-container">
          <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>

        <img src={NotificationIcon} alt="Notifications" className="notification-icon" />
        <img src={InfoIcon} alt="InfoIcon" className="info-icon" />
        
      </div>
    </header>
  );
};

export default Header;