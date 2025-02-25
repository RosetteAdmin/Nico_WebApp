import React, { useState } from "react";
import "./AddUsers.css";

const Userinfo = () => {
  const [permissions, setPermissions] = useState({
    nbGenerator: false,
    ozoneGenerator1: false,
    ozoneGenerator2: false,
  });

  const togglePermission = (key) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [key]: !prevPermissions[key],
    }));
  };

  return (
    <div className="access-management-container">
      {/* Header Section */}
      <div className="grant-access-header">
        <h1>Grant Access Permission</h1>
        <button className="grant-access-btn">Grant Access</button>
      </div>

      {/* Content Section with Flexbox */}
      <div className="content-wrapper">
        {/* Left Side - Add or Remove Access */}
        <div className="form-container">
          <h2>Add or Remove Access Details:</h2>
          <div className="form-group">
            <label>Associate Name</label>
            <input type="text" placeholder="Name" readOnly/>
          </div>
          <div className="form-group">
            <label>Email ID</label>
            <input type="email" placeholder="email@email.com" readOnly/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="text" placeholder="Password" readOnly/>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" placeholder="1234567890" readOnly/>
          </div>
          <div className="form-group">
            <label>Sector</label>
            <input type="text" placeholder="Sector Name" readOnly />
          </div>
        </div>

        {/* Right Side - Device Power Access Permissions */}
        <div className="permissions-container">
          <h3>Device Power Access Permission:</h3>
          <div className="toggle-group">
            <div>
              <span>NB Generator</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={permissions.nbGenerator}
                  onChange={() => togglePermission("nbGenerator")}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div>
              <span>Ozone Generator 1</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={permissions.ozoneGenerator1}
                  onChange={() => togglePermission("ozoneGenerator1")}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div>
              <span>Ozone Generator 2</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={permissions.ozoneGenerator2}
                  onChange={() => togglePermission("ozoneGenerator2")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;
