import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import CompanyLogo from "./../../Images/Header/NICOCompany.svg";
import nico from "./../../Images/Header/nico.svg";
import dropdownOpen from "./../../Images/Header/dropdown-open.svg";
import dropdownClose from "./../../Images/Header/dropdown-close.svg";
import profileIcon from "./../../Images/Header/profile.svg";
import logoutIcon from "./../../Images/Header/logout.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const userrole = JSON.parse(localStorage.getItem("user")).role;
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Reference for the dropdown menu
  const dropdownButtonRef = useRef(null); // Reference for the dropdown button

  // Modified to always close the dropdown when clicking the button
  const handleDropdownClick = () => {
    setShowDropdown(false); // Always close the dropdown
  };

  // Open the dropdown only if it's closed
  const openDropdown = () => {
    if (!showDropdown) {
      setShowDropdown(true);
    }
  };

  const viewprofile = () => {
    navigate("/profile");
    setShowDropdown(false); // Close dropdown on navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    navigate("/login"); // Redirect to login or home page
    setShowDropdown(false); // Close dropdown on logout
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both the dropdown menu and the button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false); // Close dropdown if click is outside
      }
    };

    // Add event listener when dropdown is open
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on component unmount or when dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]); // Re-run effect when showDropdown changes

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    email: "",
    password: "",
  });

  return (
    <header className="header">
      <img src={CompanyLogo} alt="NICO Logo" className="header-logo" />

      <div className="header-right">
        <div className="nico-container">
          <img src={nico} alt="SearchIcon" className="nico-icon" />
          <p className="header-text">NICO IT {userrole}</p>

          {/* Dropdown Button and Menu Wrapper */}
          <div className="dropdown-wrapper">
            <img
              src={showDropdown ? dropdownOpen : dropdownClose}
              alt="Dropdown"
              className="dropdown-icon"
              onClick={() => {
                if (showDropdown) {
                  handleDropdownClick(); // Close if already open
                } else {
                  openDropdown(); // Open if closed
                }
              }}
              ref={dropdownButtonRef} 
            />

            {showDropdown && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <button
                  onClick={viewprofile}
                  type="button"
                  className="dropdown-item"
                >
                  <img src={profileIcon} alt="Profile" />
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="dropdown-item logout"
                >
                  <img src={logoutIcon} alt="Logout" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;