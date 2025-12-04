import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// The CSS import has been updated to the new file name
import "./AddUser.css"; 

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

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Logic to fetch existing associate data could be added here
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
    if (!userInfo.email || !userInfo.password) {
      alert("Please fill in both email and password fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (userInfo.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const confirmCreate = window.confirm(
      `Are you sure you want to create a new Company Associate with email: ${userInfo.email}?`
    );
    
    if (!confirmCreate) return;

    setLoading(true);

    try {
      const requestData = {
        email: userInfo.email,
        password: userInfo.password,
        name: userInfo.name || null,
        phone_number: userInfo.phone_number || null,
        sector: userInfo.sector || null
      };

      const response = await fetch(`${process.env.REACT_APP_EP}/data/createcompanyassociate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Company Associate created successfully!");
        setUserInfo({ name: "", email: "", password: "", phone_number: "", sector: "" });
         setTimeout(() => navigate(-1), 500);
      } else {
        alert(`Failed to create Company Associate: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating Company Associate:", error);
      alert("Failed to create Company Associate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="create-associate-loading-backdrop">
          <div className="create-associate-loading-spinner"></div>
          <div className="create-associate-loading-text">Creating Company Associate...</div>
        </div>
      )}

      <div className="create-associate-header">
        <h1 className="create-associate-title">Grant Access Permission</h1>
        <button 
          className="create-associate-action-btn" 
          onClick={handleGrantAccess}
          disabled={loading}
        >
          {loading ? "Creating..." : "Grant Access"}
        </button>
      </div>

      <div className="create-associate-page-container">
        <div className="create-associate-content-card">
          <div className="create-associate-form-wrapper">
            <h2>Add Company Associate:</h2>

            <div className="create-associate-form-group">
              <label>Associate Name</label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                value={userInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="create-associate-form-row create-associate-two-col">
              <div className="create-associate-form-group">
                <label>Email ID *</label>
                <input 
                  type="email" 
                  placeholder="email@email.com" 
                  value={userInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="create-associate-form-group">
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

            <div className="create-associate-form-row create-associate-two-col">
              <div className="create-associate-form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="1234567890" 
                  value={userInfo.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                />
              </div>
              <div className="create-associate-form-group">
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

          {/* This part is commented out in your original code, but styles are provided for it below */}
          {/* <div className="create-associate-permissions-container"> ... </div> */}
        </div>
      </div>
    </>
  );
};

export default Userinfo;