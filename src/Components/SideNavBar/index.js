import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import "./SideNavBar.css";
import Arrow from "./../../Images/SideNavBar/ArrowIcon.svg";
import LinkIcon from "./../../Images/SideNavBar/LinkIcon.svg";
import NoteIcon from "./../../Images/SideNavBar/NoteIcon.svg";

const SideNavBar = () => {
  const [openMenu, setOpenMenu] = useState(null); // Tracks the open menu

  const toggleMenu = (menu) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu)); // Toggle menu state
  };

  return (
    <nav className="side-nav">
      <ul className="nav-list">
        {/* Dashboard */}
        <li className="nav-item">
          <Link to="/" onClick={() => toggleMenu(null)}> 
            Dashboard
          </Link>
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
              <li className="sub-item">
                <Link to="/devices">
                  <img src={LinkIcon} alt="icon" />
                  Registered Devices
                </Link>
              </li>
              <li className="sub-item">
                <Link to="/add-device">
                  <img src={NoteIcon} alt="icon" />
                  Add New Device
                </Link>
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
              <li className="sub-item">
                <Link to="/users">
                  <img src={LinkIcon} alt="icon" />
                  Registered Users
                </Link>
              </li>
              <li className="sub-item">
                <Link to="/add-user">
                  <img src={NoteIcon} alt="icon" />
                  Add New User
                </Link>
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
              <li className="sub-item">
                <Link to="/other1">
                  <img src={LinkIcon} alt="icon" />
                  Other 1
                </Link>
              </li>
              <li className="sub-item">
                <Link to="/other2">
                  <img src={NoteIcon} alt="icon" />
                  Other 2
                </Link>
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
