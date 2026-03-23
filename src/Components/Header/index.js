// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
// import "./Header.css";

// import CompanyLogo from "./../../Images/Header/NICOCompany.svg";
// import nico from "./../../Images/Header/nico.svg";
// import dropdownOpen from "./../../Images/Header/dropdown-open.svg";
// import dropdownClose from "./../../Images/Header/dropdown-close.svg";
// import profileIcon from "./../../Images/Header/profile.svg";
// import logoutIcon from "./../../Images/Header/logout.svg";

// import { Role, roleToString } from "../../constants/roles";

// const Header = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);
//   const dropdownButtonRef = useRef(null);
//   const navigate = useNavigate(); // ✅ Initialize router navigation

//   const parseJsonOrNull = (str) => {
//     try {
//       return str ? JSON.parse(str) : null;
//     } catch {
//       return null;
//     }
//   };

//   const storedUser = parseJsonOrNull(localStorage.getItem("user"));
//   const userRole =
//     storedUser && storedUser.role !== undefined && storedUser.role !== null
//       ? Number(storedUser.role)
//       : null;

//   const label =
//     userRole === Role.CompanyAssociate ? "Associate" : roleToString(userRole);

//   useEffect(() => {
//     if (label === null) {
//       localStorage.removeItem("user");
//       localStorage.removeItem("authToken");
//       navigate("/login", { replace: true }); // ✅ Client-side navigation
//     }
//   }, [label, navigate]);

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
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showDropdown]);

//   const handleDropdownClick = () => setShowDropdown(false);
//   const openDropdown = () => !showDropdown && setShowDropdown(true);

//   // ✅ Smooth React Router navigation instead of full reload
//   const viewprofile = () => {
//     navigate("/profile");
//     setShowDropdown(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//     navigate("/login", { replace: true });
//     setShowDropdown(false);
//   };

//   // ✅ Logo click handler using navigate
//   const handleLogoClick = () => {
//     navigate("/dashboard");
//   };

//   return (
//     <header className="header">
//       {/* ✅ Logo is now clickable and uses React Router navigation */}
//       <img
//         src={CompanyLogo}
//         alt="NICO Logo"
//         className="header-logo"
//         style={{ cursor: "pointer" }}
//         onClick={handleLogoClick}
//       />

//       <div className="header-right">
//         <div className="nico-container">
//           <img src={nico} alt="NICO" className="nico-icon" />

//           <p className="header-text">
//             NICO IT <span style={{ whiteSpace: "nowrap" }}>{label ?? ""}</span>
//           </p>

//           <div className="dropdown-wrapper">
//             <img
//               src={showDropdown ? dropdownOpen : dropdownClose}
//               alt="Menu"
//               className="dropdown-icon"
//               onClick={() => {
//                 if (showDropdown) {
//                   handleDropdownClick();
//                 } else {
//                   openDropdown();
//                 }
//               }}
//               ref={dropdownButtonRef}
//               aria-expanded={showDropdown}
//               role="button"
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

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

import CompanyLogo  from "./../../Images/Header/NICOCompany.svg";
import nico         from "./../../Images/Header/nico.svg";
import dropdownOpen  from "./../../Images/Header/dropdown-open.svg";
import dropdownClose from "./../../Images/Header/dropdown-close.svg";
import profileIcon  from "./../../Images/Header/profile.svg";
import logoutIcon   from "./../../Images/Header/logout.svg";

import { roleToString } from "../../constants/roles";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef       = useRef(null);
  const dropdownButtonRef = useRef(null);
  const navigate = useNavigate();

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  const userRole = storedUser?.role !== undefined && storedUser.role !== null
    ? Number(storedUser.role)
    : null;

  const label = roleToString(userRole);

  useEffect(() => {
    if (label === null) {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      navigate("/login", { replace: true });
    }
  }, [label, navigate]);

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
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const viewprofile = () => { navigate("/profile"); setShowDropdown(false); };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/login", { replace: true });
    setShowDropdown(false);
  };

  const handleLogoClick = () => navigate("/dashboard");

  return (
    <header className="header">
      <img
        src={CompanyLogo}
        alt="NICO Logo"
        className="header-logo"
        style={{ cursor: "pointer" }}
        onClick={handleLogoClick}
      />

      <div className="header-right">
        <div className="nico-container">
          <img src={nico} alt="NICO" className="nico-icon" />

          <p className="header-text">
            NICO IT{" "}
            <span style={{ whiteSpace: "nowrap" }}>{label ?? ""}</span>
          </p>

          <div className="dropdown-wrapper">
            <img
              src={showDropdown ? dropdownOpen : dropdownClose}
              alt="Menu"
              className="dropdown-icon"
              onClick={() => setShowDropdown((prev) => !prev)}
              ref={dropdownButtonRef}
              aria-expanded={showDropdown}
              role="button"
            />

            {showDropdown && (
              <div className="dropdown-options" ref={dropdownRef}>
                <button
                  onClick={viewprofile}
                  type="button"
                  className="dropdown-category"
                >
                  <img src={profileIcon} alt="Profile" />
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="dropdown-category logout"
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