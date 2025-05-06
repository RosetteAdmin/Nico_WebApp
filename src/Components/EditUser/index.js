

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EditUser.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch,faSliders } from "@fortawesome/free-solid-svg-icons";

const EditUser = () => {
  const { email } = useParams();
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phone: "",
    sector: "",
    location: "",
    devices: []
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_EP}/data/customer/${encodeURIComponent(email)}`
        );
        
        const result = await response.json();

        if (response.ok && result.status === 'success') {
          setUserData({
            email: result.data.email,
            name: result.data.name,
            phone: result.data.phone,
            sector: result.data.sector,
            location: result.data.location,
            devices: result.data.devices || []
          });
        } else {
          console.error('User not found:', result.message);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (!userData.email) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="edit-user-wrapper">
      
      
<div style={{
        display: "flex",
        justifyContent: "space-between", /* Space between title and controls */
        alignItems: "center", /* Vertically align items */
      }}>
        <h2 className="dashboard-title" style={{ margin: 0 }}>{userData.name}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="search-bar-container">
          <input
              type="text"
              placeholder="Search"
              className="search-bar"
            />
            <span className="dev-search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
          <button className="filter-button">
            <FontAwesomeIcon icon={faSliders} />
          </button>
        </div>
      </div>

      <section className="user-card">
        <div className="user-info">
          <h3>User Information</h3>
          <p><strong>Name:</strong> <em>{userData.name || "N/A"}</em></p>
          <p><strong>Location:</strong> <em>{userData.sector || "N/A"}</em></p>
        </div>
        <div className="user-contact">
          <p><strong>Email:</strong> <em>{userData.email || "N/A"}</em></p>
          <p><strong>Phone:</strong> <em>{userData.phone || "N/A"}</em></p>
        </div>
      </section>

      <section className="devices-section">
        <div className="devices-header">
          <h3>Linked Devices</h3>
        </div>
        {userData.devices && userData.devices.length > 0 ? (
          <table className="devices-table">
          </table>
        ) : (
          <div className="no-devices">No linked devices.</div>
        )}
      </section>
    </div>
  );
};

export default EditUser;



