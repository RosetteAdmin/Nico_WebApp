// import React, { useState, useEffect, useRef } from "react";
// import "./Header.css";
// import CompanyLogo from "./../../Images/Header/NICOCompany.svg";
// import nico from "./../../Images/Header/nico.svg";
// import dropdownOpen from "./../../Images/Header/dropdown-open.svg";
// import dropdownClose from "./../../Images/Header/dropdown-close.svg";
// import profileIcon from "./../../Images/Header/profile.svg";
// import logoutIcon from "./../../Images/Header/logout.svg";
// import { useNavigate } from "react-router-dom";
// import { Role, roleToString } from "../../constants/roles";  // Import role utilities

// const Header = () => {
//   const [showDropdown, setShowDropdown] = useState(false);

//   // Safely parse role from localStorage
//   const storedUser = JSON.parse(localStorage.getItem("user"));
//   const userRole = storedUser && storedUser.role !== undefined ? parseInt(storedUser.role, 10) : null;

//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
//   const dropdownButtonRef = useRef(null);

//   const handleDropdownClick = () => {
//     setShowDropdown(false);
//   };

//   const openDropdown = () => {
//     if (!showDropdown) setShowDropdown(true);
//   };

//   const viewprofile = () => {
//     navigate("/profile");
//     setShowDropdown(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//     window.location.href = "/login"; // Force full reload
//     setShowDropdown(false);
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         dropdownButtonRef.current &&
//         !dropdownButtonRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false);
//       }
//     };

//     if (showDropdown) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showDropdown]);

//   // Map role to display string ("Associate" for CompanyAssociate)
//   const displayRole = () => {
//     if (userRole === Role.CompanyAssociate) return "Associate";
//     return roleToString(userRole);
//   };

//   return (
//     <header className="header">
//       <img src={CompanyLogo} alt="NICO Logo" className="header-logo" />

//       <div className="header-right">
//         <div className="nico-container">
//           <img src={nico} alt="NICO" className="nico-icon" />
// <p className="header-text">
//   NICO IT <span style={{ whiteSpace: "nowrap" }}>{displayRole()}</span>
// </p>

//           <div className="dropdown-wrapper">
//             <img
//               src={showDropdown ? dropdownOpen : dropdownClose}
//               alt="Dropdown"
//               className="dropdown-icon"
//               onClick={() => {
//                 if (showDropdown) {
//                   handleDropdownClick();
//                 } else {
//                   openDropdown();
//                 }
//               }}
//               ref={dropdownButtonRef}
//             />

//             {showDropdown && (
//               <div className="dropdown-options" ref={dropdownRef}>
//                 <button onClick={viewprofile} type="button" className="dropdown-category">
//                   <img src={profileIcon} alt="Profile" />
//                   View Profile
//                 </button>
//                 <button onClick={handleLogout} type="button" className="dropdown-category logout">
//                   <img src={logoutIcon} alt="Logout" />
//                   Log Out
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;




// src/components/Header/index.js
import React, { useState, useEffect, useRef } from "react";
import "./Header.css";

import CompanyLogo from "./../../Images/Header/NICOCompany.svg";
import nico from "./../../Images/Header/nico.svg";
import dropdownOpen from "./../../Images/Header/dropdown-open.svg";
import dropdownClose from "./../../Images/Header/dropdown-close.svg";
import profileIcon from "./../../Images/Header/profile.svg";
import logoutIcon from "./../../Images/Header/logout.svg";

import { Role, roleToString } from "../../constants/roles";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  const parseJsonOrNull = (str) => {
    try {
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  };

  const storedUser = parseJsonOrNull(localStorage.getItem("user"));
  const userRole =
    storedUser && storedUser.role !== undefined && storedUser.role !== null
      ? Number(storedUser.role)
      : null;

  // Compute label; roleToString returns null if role invalid/missing
  const label =
    userRole === Role.CompanyAssociate ? "Associate" : roleToString(userRole);

  // If role is invalid/missing, clear session and hard-redirect to /login
  useEffect(() => {
    if (label === null) {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      window.location.replace("/login"); // full reload -> App sees logged-out state
    }
  }, [label]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleDropdownClick = () => setShowDropdown(false);
  const openDropdown = () => !showDropdown && setShowDropdown(true);

  const viewprofile = () => {
    // If you use a router Link elsewhere, you can replace this with it.
    window.location.href = "/profile";
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.replace("/login"); // ensure clean state and route exists
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <img src={CompanyLogo} alt="NICO Logo" className="header-logo" />

      <div className="header-right">
        <div className="nico-container">
          <img src={nico} alt="NICO" className="nico-icon" />

          <p className="header-text">
            NICO IT <span style={{ whiteSpace: "nowrap" }}>{label ?? ""}</span>
          </p>

          <div className="dropdown-wrapper">
            <img
              src={showDropdown ? dropdownOpen : dropdownClose}
              alt="Menu"
              className="dropdown-icon"
              onClick={() => {
                if (showDropdown) {
                  handleDropdownClick();
                } else {
                  openDropdown();
                }
              }}
              ref={dropdownButtonRef}
              aria-expanded={showDropdown}
              role="button"
            />

            {showDropdown && (
              <div className="dropdown-options" ref={dropdownRef}>
                <button onClick={viewprofile} type="button" className="dropdown-category">
                  <img src={profileIcon} alt="Profile" />
                  View Profile
                </button>
                <button onClick={handleLogout} type="button" className="dropdown-category logout">
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