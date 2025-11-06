import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddOperator.css"; // Reuse the same CSS

const AddOperator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [operatorInfo, setOperatorInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    sector: ""
  });

  const handleInputChange = (field, value) => {
    setOperatorInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateOperator = async () => {
    // Validate required fields
    if (!operatorInfo.email || !operatorInfo.password) {
      alert("Please fill in both email and password fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(operatorInfo.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (operatorInfo.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const confirmCreate = window.confirm(
      `Are you sure you want to create a new Operator with email: ${operatorInfo.email}?`
    );
    
    if (!confirmCreate) return;

    setLoading(true);

    try {
      // Prepare data to send
      const requestData = {
        email: operatorInfo.email,
        password: operatorInfo.password,
        name: operatorInfo.name || null,
        phone_number: operatorInfo.phone_number || null,
        sector: operatorInfo.sector || null
      };

      console.log("Sending data:", requestData); // Debug log

      const response = await fetch(`${process.env.REACT_APP_EP}/data/addcustomer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log("Response:", result); // Debug log

      if (result.status === "success") {
        alert("Operator created successfully!");
        // Clear the form
        setOperatorInfo({
          name: "",
          email: "",
          password: "",
          phone_number: "",
          sector: ""
        });
        
        setTimeout(() => {
          navigate("/customers"); // Navigate to operators list
        }, 500);
        
      } else {
        alert(`Failed to create Operator: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating Operator:", error);
      alert("Failed to create Operator. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner"></div>
          <div className="loading-text">Creating Operator...</div>
        </div>
      )}

      <div className="grant-access-headerr">
        <h1 className="vendor-title">Add New Operator</h1>
        <button 
          className="add-vendor-btn" 
          onClick={handleCreateOperator}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Operator"}
        </button>
      </div>

      <div className="vendor-management-container">
        <div className="vendor-content-wrapper">
          <div className="form-container">
            <h2>Add Operator Details:</h2>

            {/* Name Field */}
            <div className="form-group">
              <label>Operator Name</label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                value={operatorInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            {/* Email and Password Row */}
            <div className="form-row two-col">
              <div className="form-group">
                <label>Email ID *</label>
                <input 
                  type="email" 
                  placeholder="email@email.com" 
                  value={operatorInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input 
                  type="text" 
                  placeholder="Enter password (min 6 chars)" 
                  value={operatorInfo.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone Number and Sector Row */}
            <div className="form-row two-col">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="1234567890" 
                  value={operatorInfo.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sector</label>
                <input 
                  type="text" 
                  placeholder="Enter sector" 
                  value={operatorInfo.sector}
                  onChange={(e) => handleInputChange("sector", e.target.value)}
                />
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOperator;