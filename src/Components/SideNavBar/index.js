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

const menuItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: DashBoardIcon,
    url: "/dashboard",
  },
  {
    key: "devices",
    title: "Devices",
    icon: DevicesIcon,
    subMenu: [
      {
        key: "registered-devices",
        title: "Registered Devices",
        icon: LinkIcon,
        url: "/devices",
      },
      {
        key: "pre-reg-device",
        title: "Pre-Registered Devices",
        icon: LinkIcon,
        url: "/PreRegDevices",
      },
      {
        key: "add-device",
        title: "Add New Device",
        icon: NoteIcon,
        url: "/add-device",
      },
    ],
  },
  {
    key: "customers",
    title: "Customers",
    icon: CustomerIcon,
    url: "/customers",
  },
  {
    key: "access-management",
    title: "Access Management",
    icon: AccessManagementIcon,
    url: "/access-management",
  },
  {
    key: "service-requests",
    title: "Service Requests",
    icon: ServicesRequestIcon,
    url: "/service-requests",
  },
  {
    key: "profile",
    title: "Profile",
    icon: ProfileIcon,
    url: "/profile",
  },
];

const SideNavBar = () => {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const [selectedSubComponent, setSelectedSubComponent] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const handleComponentClick = (key) => {
    setOpenMenu(false);
    setSelectedSubComponent(null);
    setSelectedComponent(key);
  };

  const handleSubComponentClick = (key) => {
    setSelectedSubComponent(key);
  };

  const toggleMenu = (key) => {
    setOpenMenu((prevMenu) => (prevMenu === key ? null : key));
  };

  return (
    <nav className="side-nav">
      <ul className="nav-list">
        {menuItems.map((item) => (
          <li key={item.key} className="nav-item">
            {!item.subMenu ? (
              <Link
                to={item.url}
                onClick={() => handleComponentClick(item.key)}
                className="main-link"
              >
                <img
                  src={item.icon}
                  alt={`${item.title} icon`}
                  className= {selectedComponent === item.key ? "nav-icon active-img" : "nav-icon"}
                  style={{ marginRight: "10px" }}
                />
                <span
                  className={`nav-text ${
                    selectedComponent === item.key ? "active" : ""
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            ) : (
              <>
                <div
                  onClick={() => {
                    handleComponentClick(item.key);
                    toggleMenu(item.key);
                  }}
                  className="main-link"
                >
                  <img
                    src={item.icon}
                    alt={`${item.title} icon`}
                    className={
                      selectedComponent === item.key ? "nav-icon active-img" : "nav-icon"
                    }
                    style={{ marginRight: "10px" }}
                  />
                  <span
                    className={`nav-text ${
                      selectedComponent === item.key ? "active" : "unbold"
                    }`}
                  >
                    {item.title}
                  </span>
                  <img
                    src={Arrow}
                    className={`arrow-icon ${
                      openMenu === item.key ? "rotate" : ""
                    }`}
                    alt="arrow icon"
                    style={{ marginLeft: "auto" }}
                    onClick={() => toggleMenu(item.key)}
                  />
                </div>
                {openMenu === item.key && (
                  <ul className="sub-menu">
                    {item.subMenu.map((subItem) => (
                      <li key={subItem.key} className="sub-item">
                        <Link
                          to={subItem.url}
                          onClick={() => handleSubComponentClick(subItem.key)}
                          className="sub-link"
                        >
                          <img
                            src={subItem.icon}
                            alt={`${subItem.title} icon`}
                            className={
                              selectedSubComponent === subItem.key
                                ? "nav-sub-icon"
                                : "active-img"
                            }
                            style={{ marginRight: "10px" }}
                          />
                          <span
                            className={`nav-text ${
                              selectedSubComponent === subItem.key ? "active" : "nav-text"
                            }`}
                          >
                            {subItem.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNavBar;
