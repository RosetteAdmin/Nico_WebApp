import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./userinfo.css";

const Userinfo = () => {
  const { email } = useParams(); // ✅ CHANGED: Direct destructuring
  const navigate = useNavigate();
  
  // Debug logs
  console.log("URL Params - email:", email);
  
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [associateInfo, setAssociateInfo] = useState({
    email: "",
    name: "",
    phone_number: "",
    sector: "",
    role: ""
  });

  const [editableInfo, setEditableInfo] = useState({
    name: "",
    phone_number: "",
    sector: ""
  });

  // Fetch associate data on component mount
  useEffect(() => {
    const fetchAssociateData = async () => {
      console.log("Fetching data for email:", email);
      
      if (!email) {
        console.error("No email provided in URL");
        alert("No email provided");
        setLoading(false);
        return;
      }

      try {
        // ✅ FIXED: URL encode the email parameter
        const url = `${process.env.REACT_APP_EP}/data/associate/${encodeURIComponent(email)}`;
        console.log("Fetching from URL:", url);
        
        const response = await fetch(url);
        console.log("Response status:", response.status);
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("API Response:", result);

        if (result.status === "success") {
          setAssociateInfo(result.data);
          setEditableInfo({
            name: result.data.name || "",
            phone_number: result.data.phone_number || "",
            sector: result.data.sector || ""
          });
        } else {
          alert(`Failed to load associate data: ${result.message}`);
        }
      } catch (error) {
        console.error("Error fetching associate data:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociateData();
  }, [email]);

  const handleInputChange = (field, value) => {
    setEditableInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/data/updateassociate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: associateInfo.email,
          name: editableInfo.name,
          phone_number: editableInfo.phone_number,
          sector: editableInfo.sector
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        alert("Associate updated successfully!");
        setAssociateInfo(prev => ({
          ...prev,
          name: editableInfo.name,
          phone_number: editableInfo.phone_number,
          sector: editableInfo.sector
        }));
        setIsEditMode(false);
      } else {
        alert(`Failed to update associate: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating associate:", error);
      alert(`Failed to update associate: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      handleSaveChanges();
    } else {
      setIsEditMode(true);
    }
  };

  if (loading) {
    return (
      <div className="loading-backdrop">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading associate data...</div>
      </div>
    );
  }

  return (
    <div className="access-management-container">
      <div className="grant-access-header">
        <h1>Edit Associate Details</h1>
        <button className="grant-access-btn" onClick={handleEditToggle}>
          {isEditMode ? "Save Changes" : "Edit"}
        </button>
      </div>

      <div className="content-wrapper">
        <div className="form-container">
          <h2>Associate Information:</h2>
          
          <div className="form-group">
            <label>Associate Name</label>
            <input 
              type="text" 
              placeholder="Name" 
              value={isEditMode ? editableInfo.name : associateInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              readOnly={!isEditMode}
              className={isEditMode ? "editable" : ""}
            />
          </div>
          
          <div className="form-group">
            <label>Email ID</label>
            <input 
              type="email" 
              placeholder="email@email.com" 
              value={associateInfo.email}
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              placeholder="1234567890" 
              value={isEditMode ? editableInfo.phone_number : associateInfo.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              readOnly={!isEditMode}
              className={isEditMode ? "editable" : ""}
            />
          </div>
          
          <div className="form-group">
            <label>Sector</label>
            <input 
              type="text" 
              placeholder="Sector Name" 
              value={isEditMode ? editableInfo.sector : associateInfo.sector}
              onChange={(e) => handleInputChange("sector", e.target.value)}
              readOnly={!isEditMode}
              className={isEditMode ? "editable" : ""}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input 
              type="text" 
              placeholder="Role" 
              value={associateInfo.role}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;