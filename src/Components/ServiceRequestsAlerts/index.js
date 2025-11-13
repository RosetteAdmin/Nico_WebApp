import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import "./ServiceRequestsAlerts.css";

const alertsData = [];

const ServiceAlerts = () => {
  const [alerts, setAlerts] = useState(alertsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("User Generated");
  const navigate = useNavigate();

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`/userinfo/${id}`);
  };

  return (
    <>
      <div className="sra-bar-container">
        <h2 className="sra-title">Service Requests & Alerts</h2>

        <input
          type="text"
          className="sra-search-input"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="sra-search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <button className="sra-filter-button">
          <FontAwesomeIcon icon={faSliders} />
        </button>
      </div>

      <div className="sra-container">
        <div className="sra-header"></div>

        <div className="sra-tabs">
          <button
            className={`sra-tab left ${activeTab === "User Generated" ? "active" : ""}`}
            onClick={() => setActiveTab("User Generated")}
          >
            User Generated
          </button>
          <button
            className={`sra-tab center ${activeTab === "Device Triggered" ? "active" : ""}`}
            onClick={() => setActiveTab("Device Triggered")}
          >
            Device Triggered
          </button>
          <button
            className={`sra-tab right ${activeTab === "Sensor Alerts" ? "active" : ""}`}
            onClick={() => setActiveTab("Sensor Alerts")}
          >
            Sensor Alerts
          </button>
        </div>

        <table className="sra-table">
          <thead>
            <tr>
              <th>Service ID</th>
              <th>Service Type</th>
              <th>Device ID</th>
              <th>Sector</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((req) => (
                <tr key={req.id} onClick={() => handleRowClick(req.id)}>
                  <td>{req.id}</td>
                  <td>{req.type}</td>
                  <td>{req.device}</td>
                  <td>{req.sector}</td>
                  <td>
                    <button className="sra-edit">Edit</button>
                    <button className="sra-deploy">Deploy</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#1a1a1aff",
                    fontWeight: "400",
                  }}
                >
                  No Alerts
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ServiceAlerts;