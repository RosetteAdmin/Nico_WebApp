import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./operatorinfo.css";

const Operatorinfo = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [operatorInfo, setOperatorInfo] = useState({
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
    const fetchOperatorData = async () => {
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
          setOperatorInfo(result.data);
          setEditableInfo({
            name: result.data.name || "",
            phone_number: result.data.phone_number || "",
            sector: result.data.sector || ""
          });
        } else {
          alert(`Failed to load operator data: ${result.message}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOperatorData();
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
          email: operatorInfo.email,
          name: editableInfo.name,
          phone_number: editableInfo.phone_number,
          sector: editableInfo.sector
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.status === "success") {
        alert("Operator updated successfully!");
        setOperatorInfo(prev => ({
          ...prev,
          name: editableInfo.name,
          phone_number: editableInfo.phone_number,
          sector: editableInfo.sector
        }));
        setIsEditMode(false);
        setTimeout(() => navigate("/operators"), 500);
      } else {
        alert(`Failed to update operator: ${result.message}`);
      }
    } catch (error) {
      alert(`Failed to update operator: ${error.message}`);
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
      <div className="loading-backdrop">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading operator data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="grant-access-headerr">
        <h1 className="vendor-title">Edit Operator Details</h1>
        <button
          className="add-vendor-btn"
          onClick={handleEditToggle}
          disabled={loading}
        >
          {isEditMode ? (loading ? "Saving..." : "Save Changes") : "Edit"}
        </button>
      </div>

      <div className="vendor-management-container">
        <div className="vendor-content-wrapper">
          <div className="form-container">
            <h2>Change Details:</h2>

            <div className="form-row two-col">
              <div className="form-group">
                <label>Operator Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={isEditMode ? editableInfo.name : operatorInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>

              <div className="form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  placeholder="email@email.com"
                  value={operatorInfo.email}
                  readOnly
                  className="readonly-field"
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="1234567890"
                  value={isEditMode ? editableInfo.phone_number : operatorInfo.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>

              <div className="form-group">
                <label>Sector</label>
                <input
                  type="text"
                  placeholder="Enter sector"
                  value={isEditMode ? editableInfo.sector : operatorInfo.sector}
                  onChange={(e) => handleInputChange("sector", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  placeholder="Role"
                  value={operatorInfo.role}
                  readOnly
                  className="readonly-field"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Operatorinfo;