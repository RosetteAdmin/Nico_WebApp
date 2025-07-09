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

// Define menu items with role-based access
const menuItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: DashBoardIcon,
    url: "/dashboard",
    roles: ["Admin", "Company Associate", "Customer", "Vendor"],
  },
  {
    key: "devices",
    title: "Devices",
    icon: DevicesIcon,
    roles: ["Admin", "Company Associate","Customer","Vendor"],
    subMenu: [
      {
        key: "registered-devices",
        title: "Installed",
        url: "/devices",
        roles: ["Admin", "Company Associate","Vendor"],
      },
      {
        key: "pre-reg-device",
        title: "Registered",
        url: "/PreRegDevices",
        roles: ["Admin", "Company Associate","Vendor"],
      },
      // {
      //   key: "add-device",
      //   title: "Add New Device",
      //   url: "/add-device",
      //   roles: ["Admin", "Company Associate","Vendor"],
      // },
    ],
  },
  {
    key: "customers",
    title: "Customers",
    icon: CustomerIcon,
    url: "/customers",
    roles: ["Admin", "Company Associate","Vendor"],
  },
  {
    key: "access-management",
    title: "User Access",
    icon: AccessManagementIcon,
    url: "/access-management",
    roles: ["Admin"],
    subMenu: [
      {
        key: "company-associates",
        title: "Associates",
        url: "/caccess",
        roles: ["Admin"],
      },
      {
        key: "vendors",
        title: "Vendors",
        url: "/vaccess",
        roles: ["Admin"],
      },
    ],
  },
  {
    key: "service-requests",
    title: "Service Requests",
    icon: ServicesRequestIcon,
    url: "/service-requests",
    roles: ["Admin", "Company Associate", "Vendor"],
  },
  // {
  //   key: "profile",
  //   title: "Profile",
  //   icon: ProfileIcon,
  //   url: "/profile",
  //   roles: ["Admin", "Customer"],
  // },
];

const SideNavBar = () => {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const [selectedSubComponent, setSelectedSubComponent] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const userRole =  JSON.parse(localStorage.getItem("user")).role; // manage access

  const handleComponentClick = (key) => {
    setOpenMenu(false);
    setSelectedSubComponent(null);
    setSelectedComponent(key);
  };

  const handleSubComponentClick = (key) => {
    setSelectedSubComponent(key);

    const parent = menuItems.find((item) =>
      item.subMenu?.some((subItem) => subItem.key === key)
    );
    if (parent) {
      setSelectedComponent(parent.key);
    }
  };

  const toggleMenu = (key) => {
    setOpenMenu((prevMenu) => (prevMenu === key ? null : key));
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems
    .filter((item) => item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      subMenu: item.subMenu?.filter((subItem) => subItem.roles.includes(userRole)),
    }))
    .filter((item) => !item.subMenu || item.subMenu.length > 0);

  return (
<nav
    className={`side-nav ${isHovered ? "" : "collapsed"}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => {
      setIsHovered(false);
      setOpenMenu(null); // Close any open sub-menus when not hovered
    }}
  >      <ul className="nav-list">
        {filteredMenuItems.map((item) => (
          <li key={item.key} className={`nav-item${openMenu === item.key ? " open" : ""}`}>
            {!item.subMenu ? (
              <Link
                to={item.url}
                onClick={() => handleComponentClick(item.key)}
                className={`main-link ${selectedComponent === item.key ? "active" : ""}`}
              >
                <img
                  src={item.icon}
                  alt={`${item.title} icon`}
                  className={selectedComponent === item.key ? "nav-icon active-icon" : "nav-icon"}
                  style={{ marginRight: "10px" }}
                />
                <span
                  className={`nav-text ${selectedComponent === item.key ? "active" : ""}`}
                >
                  {item.title}
                </span>
              </Link>
            ) : (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComponentClick(item.key);
                    toggleMenu(item.key === openMenu ? null : item.key);
                  }}
                  className={`main-link ${selectedComponent === item.key ? "active" : ""}`}
                >
                  <img
                    src={item.icon}
                    alt={`${item.title} icon`}
                    className={
                      selectedComponent === item.key ? "nav-icon active-icon" : "nav-icon"
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
                    className={`arrow-icon ${openMenu === item.key ? "rotate" : ""}`}
                    alt="arrow icon"
                    style={{ marginLeft: "auto" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(item.key === openMenu ? null : item.key);
                    }}
                  />
                </div>
                {openMenu === item.key && (
                  <ul className="sub-menu">
                    {item.subMenu.map((subItem) => (
                      <li key={subItem.key} className="sub-item">
                        <Link
                          to={subItem.url}
                          onClick={() => handleSubComponentClick(subItem.key)}
                          className={`sub-link ${
                            selectedSubComponent === subItem.key ? "active" : ""
                          }`}
                        >
                          {subItem.icon && (
                            <img
                              src={subItem.icon}
                              alt={`${subItem.title} icon`}
                              className={`nav-sub-icon ${
                                selectedSubComponent === subItem.key ? "active-icon" : ""
                              }`}
                            />
                          )}
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