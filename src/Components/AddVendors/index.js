import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// The CSS import has been updated to the new file name
import "./AddVendor.css"; 

const Userinfo = () => {
  const [permissions, setPermissions] = useState({
    nbGenerator: false,
    ozoneGenerator1: false,
    ozoneGenerator2: false,
  });

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    sector: ""
  });

  // Add at top of component:
const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
})();

// In handleGrantAccess, update requestData:
const requestData = {
  email: userInfo.email,
  password: userInfo.password,
  name: userInfo.name || null,
  phone_number: userInfo.phone_number || null,
  sector: userInfo.sector || null,
  caller_email: storedUser?.email || null,
  caller_role: storedUser?.role !== undefined ? Number(storedUser.role) : null,
};


  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Add logic here to fetch existing vendor data if needed
    }
  }, [id]);

  const togglePermission = (key) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [key]: !prevPermissions[key],
    }));
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGrantAccess = async () => {
    // Validate required fields
    if (!userInfo.email || !userInfo.password) {
      alert("Please fill in both email and password fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (userInfo.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const confirmCreate = window.confirm(
      `Are you sure you want to create a new Customer Admin with email: ${userInfo.email}?`
    );
    
    if (!confirmCreate) return;

    setLoading(true);

    try {
      // Prepare data to send
      const requestData = {
        email: userInfo.email,
        password: userInfo.password,
        name: userInfo.name || null,
        phone_number: userInfo.phone_number || null,
        sector: userInfo.sector || null
      };

      const response = await fetch(`${process.env.REACT_APP_EP}/data/createvendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Customer Admin created successfully!");
        setUserInfo({ name: "", email: "", password: "", phone_number: "", sector: "" });
        setTimeout(() => navigate(-1), 500);
      } else {
        alert(`Failed to create Customer Admin: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating Customer Admin:", error);
      alert("Failed to create Customer Admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="create-local-admin-loading-backdrop">
          <div className="create-local-admin-loading-spinner"></div>
          <div className="create-local-admin-loading-text">Creating Customer Admin...</div>
        </div>
      )}

      <div className="create-local-admin-header">
        <h1 className="create-local-admin-title">Grant Access Permission</h1>
        <button 
          className="create-local-admin-action-btn" 
          onClick={handleGrantAccess}
          disabled={loading}
        >
          {loading ? "Creating..." : "Grant Access"}
        </button>
      </div>

      <div className="create-local-admin-page-container">
        <div className="create-local-admin-content-card">
          <div className="create-local-admin-form-wrapper">
            <h2>Add Customer Admin:</h2>

            <div className="create-local-admin-form-group">
              <label>Customer Admin Name</label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                value={userInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="create-local-admin-form-row create-local-admin-two-col">
              <div className="create-local-admin-form-group">
                <label>Email ID *</label>
                <input 
                  type="email" 
                  placeholder="email@email.com" 
                  value={userInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="create-local-admin-form-group">
                <label>Password *</label>
                <input 
                  type="text" 
                  placeholder="Enter password (min 6 chars)" 
                  value={userInfo.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="create-local-admin-form-row create-local-admin-two-col">
              <div className="create-local-admin-form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="1234567890" 
                  value={userInfo.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                />
              </div>
              <div className="create-local-admin-form-group">
                <label>Sector</label>
                <input 
                  type="text" 
                  placeholder="Enter sector" 
                  value={userInfo.sector}
                  onChange={(e) => handleInputChange("sector", e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
              <small>* Required fields</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userinfo;