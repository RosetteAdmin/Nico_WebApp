import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import "./SideNavBar.css";
import Arrow from "./../../Images/SideNavBar/ArrowIcon.svg";
import LinkIcon from "./../../Images/SideNavBar/LinkIcon.svg";
import NoteIcon from "./../../Images/SideNavBar/NoteIcon.svg";
import AccessManagementIcon from "./../../Images/SideNavBar/Access_Management.svg";
import CustomerIcon from "./../../Images/SideNavBar/Customers.svg";
import DashBoardIcon from "./../../Images/SideNavBar/DashBoard.svg";
import DevicesIcon from "./../../Images/SideNavBar/Devices.svg";
import ProfileIcon from "./../../Images/SideNavBar/Profile.svg";
import ServicesRequestIcon from "./../../Images/SideNavBar/ServicesRequest.svg";

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
          <Link to="/" onClick={() => toggleMenu(null)} className="main-link">
            <img
              src={DashBoardIcon}
              alt="dashboard icon"
              style={{ marginRight: "10px" }}
            />
            Dashboard
          </Link>
        </li>

        {/* Devices */}
        <li className="nav-item">
          <hr />
          <div onClick={() => toggleMenu("devices")} className="main-link">
            <img
              src={DevicesIcon}
              alt="devices icon"
              style={{ marginRight: "10px" }}
            />
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
                <Link to="/devices" className="sub-link">
                  <img
                    src={LinkIcon}
                    alt="registered devices icon"
                    style={{ marginRight: "10px" }}
                  />
                  Registered Devices
                </Link>
              </li>
              <li className="sub-item">
                <Link to="/add-device" className="sub-link">
                  <img
                    src={NoteIcon}
                    alt="add device icon"
                    style={{ marginRight: "10px" }}
                  />
                  Add New Device
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Customers */}
        <li className="nav-item">
          <hr />
          <Link to="/" onClick={() => toggleMenu(null)} className="main-link">
            <img
              src={CustomerIcon}
              alt="icon"
              style={{ marginRight: "10px" }}
            />
            Customers
          </Link>
        </li>

        {/* Access Managements */}
        <li className="nav-item">
          <hr />
          <Link to="/" onClick={() => toggleMenu(null)} className="main-link">
            <img
              src={AccessManagementIcon}
              alt="icon"
              style={{ marginRight: "10px" }}
            />
            Access Managements
          </Link>
        </li>

        {/* Services Requests */}
        <li className="nav-item">
          <hr />
          <Link to="/" onClick={() => toggleMenu(null)} className="main-link">
            <img
              src={ServicesRequestIcon}
              alt="icon"
              style={{ marginRight: "10px" }}
            />
            Services Requests
          </Link>
        </li>

        {/* Profile */}
        <li className="nav-item">
          <hr />
          <Link to="/" onClick={() => toggleMenu(null)} className="main-link">
            <img src={ProfileIcon} alt="icon" style={{ marginRight: "10px" }} />
              Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;

/*
#0C5890
*/