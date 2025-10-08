import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditDevice.css";

const EditDevice = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    sector: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch device data on component mount
  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`);
        if (!response.ok) throw new Error("Failed to fetch device info");
        
        const result = await response.json();
        
        if (result.status === "success" && result.data) {
          setUserInfo({
            name: result.data.owner_name || "",
            email: result.data.email_id || "",
            phone: result.data.phone_number || "",
            sector: result.data.location || ""
          });
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
        alert("Failed to load device data");
      } finally {
        setFetchingData(false);
      }
    };

    if (id) {
      fetchDeviceData();
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    // Validate required fields
    if (!userInfo.email || !userInfo.name) {
      alert("Please fill in both owner name and email fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const confirmUpdate = window.confirm(
      `Are you sure you want to update this device?`
    );
    
    if (!confirmUpdate) return;

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/data/updatedevice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          azure_device_id: id,
          owner_name: userInfo.name,
          email_id: userInfo.email,
          phone_number: userInfo.phone,
          location: userInfo.sector
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Device updated successfully!");
        // Navigate back to device details page
        navigate(`/device/${id}`);
      } else {
        alert(`Failed to update device: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating device:", error);
      alert("Failed to update device. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="loading-backdrop">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading device data...</div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner"></div>
          <div className="loading-text">Updating device...</div>
        </div>
      )}

      <div className="grant-access-headerr">
        <h1 className="vendor-title">Edit Device Details</h1>
        <button 
          className="add-vendor-btn" 
          onClick={handleSaveChanges}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="vendor-management-container">
        <div className="vendor-content-wrapper">
          <div className="form-container">
            <h2>Change Details:</h2>
            
            <div className="form-row two-col">
              <div className="form-group">
                <label>Owner Name</label>
                <input 
                  type="text" 
                  placeholder="Owner Name" 
                  value={userInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Owner Email ID</label>
                <input 
                  type="email" 
                  placeholder="Owner Email ID" 
                  value={userInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-row two-col">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={userInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Device Sector</label>
                <input 
                  type="text" 
                  placeholder="Device Sector" 
                  value={userInfo.sector}
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

export default EditDevice;