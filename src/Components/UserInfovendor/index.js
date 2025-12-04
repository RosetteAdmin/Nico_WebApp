import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// The CSS import has been updated to the new file name
import "./userinfo.css"; 

const UserinfoVendor = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [localAdminInfo, setLocalAdminInfo] = useState({
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

  useEffect(() => {
    const fetchLocalAdminData = async () => {
      if (!email) {
        alert("No email provided");
        setLoading(false);
        return;
      }

      try {
        const url = `${process.env.REACT_APP_EP}/data/associate/${encodeURIComponent(email)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();

        if (result.status === "success") {
          setLocalAdminInfo(result.data);
          setEditableInfo({
            name: result.data.name || "",
            phone_number: result.data.phone_number || "",
            sector: result.data.sector || ""
          });
        } else {
          alert(`Failed to load local admin data: ${result.message}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalAdminData();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localAdminInfo.email,
          name: editableInfo.name,
          phone_number: editableInfo.phone_number,
          sector: editableInfo.sector
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.status === "success") {
        alert("Local Admin updated successfully!");
        setLocalAdminInfo(prev => ({
          ...prev,
          name: editableInfo.name,
          phone_number: editableInfo.phone_number,
          sector: editableInfo.sector
        }));
        setIsEditMode(false);
        setTimeout(() => navigate("/vaccess"), 500);
      } else {
        alert(`Failed to update local admin: ${result.message}`);
      }
    } catch (error) {
      alert(`Failed to update local admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) handleSaveChanges();
    else setIsEditMode(true);
  };

  if (loading) {
    return (
      <div className="edit-local-admin-loading-backdrop">
        <div className="edit-local-admin-loading-spinner"></div>
        <div className="edit-local-admin-loading-text">Loading local admin data...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header section */}
      <div className="edit-local-admin-header">
        <h1 className="edit-local-admin-title">Edit Local Admin Details</h1>
        <button
          className="edit-local-admin-action-btn"
          onClick={handleEditToggle}
          disabled={loading}
        >
          {isEditMode ? (loading ? "Saving..." : "Save Changes") : "Edit"}
        </button>
      </div>

      {/* Main container */}
      <div className="edit-local-admin-page-container">
        <div className="edit-local-admin-content-card">
          <div className="edit-local-admin-form-wrapper">
            <h2>Change Details:</h2>

            <div className="edit-local-admin-form-row edit-local-admin-two-col">
              <div className="edit-local-admin-form-group">
                <label>Local Admin Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={isEditMode ? editableInfo.name : localAdminInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>

              <div className="edit-local-admin-form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  placeholder="email@email.com"
                  value={localAdminInfo.email}
                  readOnly
                  className="edit-local-admin-readonly-field"
                />
              </div>
            </div>

            <div className="edit-local-admin-form-row edit-local-admin-two-col">
              <div className="edit-local-admin-form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="1234567890"
                  value={isEditMode ? editableInfo.phone_number : localAdminInfo.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>

              <div className="edit-local-admin-form-group">
                <label>Sector</label>
                <input
                  type="text"
                  placeholder="Enter sector"
                  value={isEditMode ? editableInfo.sector : localAdminInfo.sector}
                  onChange={(e) => handleInputChange("sector", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div className="edit-local-admin-form-row">
              <div className="edit-local-admin-form-group">
                <label>Role</label>
                <input
                  type="text"
                  placeholder="Role"
                  value={localAdminInfo.role}
                  readOnly
                  className="edit-local-admin-readonly-field"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserinfoVendor;