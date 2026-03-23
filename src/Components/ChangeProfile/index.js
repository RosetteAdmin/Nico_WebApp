import React, { useState, useEffect } from "react";
import blueband from "./../../Images/Dashboard/blueband.svg";
import "./ChangeProfile.css";

// Import Role constants and helper — SINGLE import, not duplicated
import { roleToString } from "../../constants/roles";

const ChangeProfile = ({ onLogout }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser && storedUser.role !== undefined ? parseInt(storedUser.role, 10) : null;
  const userEmail = storedUser?.email || "";

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    sector: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userEmail) {
        setError("User email not found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const url = `${process.env.REACT_APP_EP}/data/associate/${encodeURIComponent(userEmail)}`;
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === "success") {
          // Set form data with fetched details
          setFormData({
            name: result.data.name || "",
            phone_number: result.data.phone_number || "",
            sector: result.data.sector || "",
            email: result.data.email || userEmail,
            password: "********",
          });
        } else {
          throw new Error(result.message || "Failed to load user details");
        }

      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.message || "Failed to load user details");
        
        // Fallback to localStorage data
        setFormData((prevData) => ({
          ...prevData,
          email: userEmail,
          password: "********",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Prepare data to send - exactly like UserinfoVendor
      const dataToUpdate = {
        email: formData.email,
        name: formData.name,
        phone_number: formData.phone_number,
        sector: formData.sector,
      };

      // Only include password if it was changed
      if (formData.password && formData.password !== "********") {
        dataToUpdate.password = formData.password;
      }

      console.log("Sending data:", dataToUpdate);

      const response = await fetch(`${process.env.REACT_APP_EP}/data/updateassociate`, {
        method: "POST", // ✅ Changed from PUT to POST
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response:", result);

      if (result.status === "success") {
        // Update localStorage with new data
        const updatedUser = {
          ...storedUser,
          name: formData.name,
          phone_number: formData.phone_number,
          sector: formData.sector,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        alert("Profile updated successfully!");
        
        // Reset password field to masked
        setFormData((prevData) => ({
          ...prevData,
          password: "********",
        }));
      } else {
        throw new Error(result.message || "Failed to update profile");
      }

    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      alert(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="change-profile-main">
      <div className="change-profile-header">
        <h2>My Profile</h2>
        <button 
          className="change-profile-save-button" 
          type="button" 
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && (
        <div className="change-profile-error" style={{ 
          color: '#721c24', 
          padding: '12px', 
          marginBottom: '15px', 
          background: '#f8d7da', 
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="change-profile-loading" style={{ textAlign: 'center', padding: '20px' }}>
          Loading profile...
        </div>
      ) : (
        <div className="change-profile-container">
          <form className="change-profile-form" onSubmit={(e) => e.preventDefault()}>
            <div className="change-profile-form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                disabled={saving}
              />
            </div>
            
            <div className="change-profile-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                readOnly
                className="readonly-field"
              />
            </div>
            
            <div className="change-profile-form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                id="phone_number"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Your Phone Number"
                disabled={saving}
              />
            </div>
            
            <div className="change-profile-form-group">
              <label htmlFor="role">Logged In as</label>
              <input
                id="role"
                type="text"
                value={roleToString(userRole)}
                readOnly
                className="readonly-field"
              />
            </div>
            
            <div className="change-profile-form-group">
              <label htmlFor="sector">Sector</label>
              <input
                id="sector"
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                placeholder="Your Sector"
                disabled={saving}
              />
            </div>
            
            <div className="change-profile-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password to change"
                disabled={saving}
                readOnly
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                {/* Leave as ******** to keep current password */}
              </small>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChangeProfile;