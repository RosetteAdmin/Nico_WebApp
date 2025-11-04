import React, { useState, useEffect, useRef } from "react";
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

// Role mapping: 0 = Admin, 1 = Company Associate, 2 = Vendor, 3 = Customer
const menuItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: DashBoardIcon,
    url: "/dashboard",
    roles: [0, 1, 3, 2],
  },
  {
    key: "devices",
    title: "Devices",
    icon: DevicesIcon,
    roles: [0, 1, 3, 2],
    subMenu: [
      {
        key: "registered-devices",
        title: "Installed",
        url: "/devices",
        roles: [0, 1, 3, 2],
      },
      {
        key: "pre-reg-device",
        title: "Registered",
        url: "/PreRegDevices",
        roles: [0, 1, 2],
      },
    ],
  },
  {
    key: "access-management",
    title: "User Access",
    icon: AccessManagementIcon,
    url: "/access-management",
    roles: [0, 1, 2],
    subMenu: [
      {
        key: "company-associates",
        title: "Associates",
        url: "/caccess",
        roles: [0],
      },
      {
        key: "vendors",
        title: "Local Admins",
        url: "/vaccess",
        roles: [0, 1],
      },
      {
        key: "customers",
        title: "Operators",
        url: "/customers",
        roles: [0, 1, 2],
      },
    ],
  },
  {
    key: "service-requests",
    title: "Service Requests",
    icon: ServicesRequestIcon,
    url: "/service-requests",
    roles: [0, 1, 2],
  },
];

const SideNavBar = () => {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const [selectedSubComponent, setSelectedSubComponent] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const navRef = useRef(null);

  // Parse stored role as integer
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser && storedUser.role !== undefined ? parseInt(storedUser.role, 10) : null;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Close menu when switching from mobile to desktop
      if (!mobile) {
        setOpenMenu(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside to close submenu on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile]);

  const handleComponentClick = (key, hasSubMenu) => {
    if (isMobile && hasSubMenu) {
      // On mobile, toggle submenu instead of navigating
      toggleMenu(key);
    } else if (!hasSubMenu) {
      // Navigate if no submenu
      setOpenMenu(null);
      setSelectedSubComponent(null);
      setSelectedComponent(key);
    } else {
      // Desktop with submenu
      setSelectedComponent(key);
    }
  };

  const handleSubComponentClick = (key) => {
    setSelectedSubComponent(key);
    const parent = menuItems.find((item) => item.subMenu?.some((subItem) => subItem.key === key));
    if (parent) {
      setSelectedComponent(parent.key);
    }
    
    // Close submenu on mobile after selection
    if (isMobile) {
      setOpenMenu(null);
    }
  };

  const toggleMenu = (key) => {
    setOpenMenu((prevMenu) => (prevMenu === key ? null : key));
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      setOpenMenu(null);
    }
  };

  // Filter menu items based on userRole
  const filteredMenuItems = menuItems
    .filter((item) => item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      subMenu: item.subMenu?.filter((subItem) => subItem.roles.includes(userRole)),
    }))
    .filter((item) => !item.subMenu || item.subMenu.length > 0);

  return (
    <nav
      ref={navRef}
      className={`side-nav ${isHovered ? "" : "collapsed"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul className="nav-list">
        {filteredMenuItems.map((item) => (
          <li 
            key={item.key} 
            className={`nav-item${openMenu === item.key ? " open" : ""}${item.subMenu ? " has-submenu" : ""}`}
          >
            {!item.subMenu ? (
              <Link
                to={item.url}
                onClick={() => handleComponentClick(item.key, false)}
                className={`main-link ${selectedComponent === item.key ? "active" : ""}`}
              >
                <img
                  src={item.icon}
                  alt={`${item.title} icon`}
                  className={selectedComponent === item.key ? "nav-icon active-icon" : "nav-icon"}
                  style={{ marginRight: "10px" }}
                />
                <span className={`nav-text ${selectedComponent === item.key ? "active" : ""}`}>
                  {item.title}
                </span>
              </Link>
            ) : (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComponentClick(item.key, true);
                    
                    // Desktop behavior - toggle on click
                    if (!isMobile) {
                      toggleMenu(item.key === openMenu ? null : item.key);
                    }
                  }}
                  className={`main-link ${selectedComponent === item.key ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
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
                  {!isMobile && (
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
                  )}
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
                            className={`sub-text ${
                              selectedSubComponent === subItem.key ? "active" : ""
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