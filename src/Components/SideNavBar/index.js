import React, { useState } from "react";
import "./SideNavBar.css";
import Arrow from "./../../Images/SideNavBar/ArrowIcon.svg";
import LinkIcon from "./../../Images/SideNavBar/LinkIcon.svg";
import NoteIcon from "./../../Images/SideNavBar/NoteIcon.svg";

const SideNavBar = ({ onMenuClick }) => {
  const [openMenu, setOpenMenu] = useState(null); // Tracks the open menu

  const toggleMenu = (menu) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu)); // Toggle menu state
  };

  return (
    <nav className="side-nav">
      <ul className="nav-list">
        {/* Dashboard */}
        <li
          className="nav-item"
          onClick={() => {
            toggleMenu(null); // Close all menus
            onMenuClick("dashboard"); // Pass "dashboard" to parent
          }}
        >
          Dashboard
        </li>

        {/* Devices */}
        <li className="nav-item">
          <hr />
          <div onClick={() => toggleMenu("devices")}>
            Devices
            <img
              src={Arrow}
              className={`arrow-icon ${openMenu === "devices" ? "rotate" : ""}`}
              alt="arrow icon"
            />
          </div>
          {openMenu === "devices" && (
            <ul className="sub-menu">
              <li
                className="sub-item"
                onClick={() => onMenuClick("Registered Devices")}
              >
                <img src={LinkIcon} alt="icon" />
                Registered Devices
              </li>
              <li
                className="sub-item"
                onClick={() => onMenuClick("Add New Device")}
              >
                <img src={NoteIcon} alt="icon" />
                Add New Device
              </li>
            </ul>
          )}
        </li>

        {/* Users */}
        <li className="nav-item">
          <hr />
          <div onClick={() => toggleMenu("users")}>
            Users
            <img
              src={Arrow}
              className={`arrow-icon ${openMenu === "users" ? "rotate" : ""}`}
              alt="arrow icon"
            />
          </div>
          {openMenu === "users" && (
            <ul className="sub-menu">
              <li
                className="sub-item"
                onClick={() => onMenuClick("Registered Users")}
              >
                <img src={LinkIcon} alt="icon" />
                Registered Users
              </li>
              <li
                className="sub-item"
                onClick={() => onMenuClick("Add New User")}
              >
                <img src={NoteIcon} alt="icon" />
                Add New User
              </li>
            </ul>
          )}
        </li>

        {/* Others */}
        <li className="nav-item">
          <hr />
          <div onClick={() => toggleMenu("others")}>
            Others
            <img
              src={Arrow}
              className={`arrow-icon ${openMenu === "others" ? "rotate" : ""}`}
              alt="arrow icon"
            />
          </div>
          {openMenu === "others" && (
            <ul className="sub-menu">
              <li
                className="sub-item"
                onClick={() => onMenuClick("Other 1")}
              >
                <img src={LinkIcon} alt="icon" />
                Other 1
              </li>
              <li
                className="sub-item"
                onClick={() => onMenuClick("Other 2")}
              >
                <img src={NoteIcon} alt="icon" />
                Other 2
              </li>
            </ul>
          )}
          <hr />
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;
