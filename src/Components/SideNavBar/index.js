import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashBoardIcon from "./../../Images/SideNavBar/DashBoard.svg";
import DevicesIcon from "./../../Images/SideNavBar/Devices.svg";
import CustomerIcon from "./../../Images/SideNavBar/Customers.svg";
import AccessManagementIcon from "./../../Images/SideNavBar/Access_Management.svg";
import ServicesRequestIcon from "./../../Images/SideNavBar/ServicesRequest.svg";
import ProfileIcon from "./../../Images/SideNavBar/Profile.svg";
import Arrow from "./../../Images/SideNavBar/ArrowIcon.svg";
import LinkIcon from "./../../Images/SideNavBar/LinkIcon.svg";
import NoteIcon from "./../../Images/SideNavBar/NoteIcon.svg";
import "./SideNavBar.css";

const SideNavBar = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const toggleMenu = (menu) => {
    setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  return (
    <nav className="side-nav">
      <ul className="nav-list">
        {/* Dashboard */}
        <li className="nav-item">
          <Link
            to="/"
            onClick={() => handleComponentClick("dashboard")}
            className="main-link"
          >
            <img
              src={DashBoardIcon}
              alt="dashboard icon"
              className={selectedComponent === "dashboard" ? "active-img" : ""}
              style={{ marginRight: "10px" }}
            />
            <span
              className={`nav-text ${
                selectedComponent === "dashboard" ? "active" : ""
              }`}
            >
              Dashboard
            </span>
          </Link>
        </li>

        {/* Devices */}
        <li className="nav-item devices">
          <div
            onClick={() => {
              handleComponentClick("devices");
              toggleMenu("devices");
            }}
            className="main-link"
          >
            <img
              src={DevicesIcon}
              alt="devices icon"
              className={selectedComponent === "devices" ? "active-img" : ""}
              style={{ marginRight: "10px" }}
            />
            <span
              className={`nav-text ${
                selectedComponent === "devices" ? "active" : "unbold"
              }`}
            >
              Devices
            </span>
            <img
              src={Arrow}
              className={`arrow-icon ${openMenu === "devices" ? "rotate" : ""}`}
              alt="arrow icon"
              style={{ marginLeft: "auto" }}
            />
          </div>
          {openMenu === "devices" && (
            <ul className="sub-menu">
              <li className="sub-item">
                <Link
                  to="/devices"
                  onClick={() =>
                    handleComponentClick("registered-devices")
                  }
                  className="sub-link"
                >
                  <img
                    src={LinkIcon}
                    className={
                      selectedComponent === "registered-devices"
                        ? "active-img"
                        : ""
                    }
                    alt="registered devices icon"
                    style={{ marginRight: "10px" }}
                  />
                  <span
                    className={`sub-text ${
                      selectedComponent === "registered-devices" ? "active" : ""
                    }`}
                  >
                    Registered Devices
                  </span>
                </Link>
              </li>
              <li className="sub-item">
                <Link
                  to="/add-device"
                  onClick={() => handleComponentClick("add-device")}
                  className="sub-link"
                >
                  <img
                    src={NoteIcon}
                    className={
                      selectedComponent === "add-device" ? "active-img" : ""
                    }
                    alt="add device icon"
                    style={{ marginRight: "10px" }}
                  />
                  <span
                    className={`sub-text ${
                      selectedComponent === "add-device" ? "active" : ""
                    }`}
                  >
                    Add New Device
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Customers */}
        <li className="nav-item">
          <Link
            to="/customers"
            onClick={() => handleComponentClick("customers")}
            className="main-link"
          >
            <img
              src={CustomerIcon}
              className={selectedComponent === "customers" ? "active-img" : ""}
              alt="customers icon"
              style={{ marginRight: "10px" }}
            />
            <span
              className={`nav-text ${
                selectedComponent === "customers" ? "active" : ""
              }`}
            >
              Customers
            </span>
          </Link>
        </li>

        {/* Access Management */}
        <li className="nav-item">
          <Link
            to="/access-management"
            onClick={() => handleComponentClick("access-management")}
            className="main-link"
          >
            <img
              src={AccessManagementIcon}
              className={
                selectedComponent === "access-management" ? "active-img" : ""
              }
              alt="access management icon"
              style={{ marginRight: "10px" }}
            />
            <span
              className={`nav-text ${
                selectedComponent === "access-management" ? "active" : ""
              }`}
            >
              Access Management
            </span>
          </Link>
        </li>

        {/* Service Requests */}
        <li className="nav-item">
          <Link
            to="/service-requests"
            onClick={() => handleComponentClick("service-requests")}
            className="main-link"
          >
            <img
              src={ServicesRequestIcon}
              className={
                selectedComponent === "service-requests" ? "active-img" : ""
              }
              alt="service requests icon"
              style={{ marginRight: "10px" }}
            />
            <span
              className={`nav-text ${
                selectedComponent === "service-requests" ? "active" : ""
              }`}
            >
              Service Requests
            </span>
          </Link>
        </li>

        {/* Profiles */}
        <li className="nav-item">
          <Link
            to="/profiles"
            onClick={() => handleComponentClick("profiles")}
            className="main-link"
          >
            <img
              src={ProfileIcon}
              className={selectedComponent === "profiles" ? "active-img" : ""}
              alt="profiles icon"
              style={{ marginRight: "10px" }}
            />
            <span
              className={`nav-text ${
                selectedComponent === "profiles" ? "active" : ""
              }`}
            >
              Profiles
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;
