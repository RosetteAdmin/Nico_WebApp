<<<<<<< HEAD
import React from "react";
import "./ServiceRequestsAlerts.css";

const ServiceRequestsAlerts = () => {
  const requests = [
    { id: "00001", type: "User Generated", device: "NICO", sector: "Karnataka" },
    { id: "00002", type: "User Generated", device: "Fishery Dept", sector: "Kerala" },
    { id: "00003", type: "System Generated", device: "XYZAB", sector: "Pune" },
    { id: "00004", type: "System Generated", device: "Delhi Zoo", sector: "New Delhi" },
  ];
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import "./ServiceRequestsAlerts.css";

const alertsData = [
  { id: "00001", type: "User Generated", device: "NICO", sector: "Karnataka" },
  { id: "00002", type: "User Generated", device: "Fishery Dept", sector: "Kerala" },
  { id: "00003", type: "System Generated", device: "XYZAB", sector: "Pune" },
  { id: "00004", type: "System Generated", device: "Delhi Zoo", sector: "New Delhi" },
];

const ServiceAlerts = () => {
  const [alerts, setAlerts] = useState(alertsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("User Generated"); // Track active tab
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
>>>>>>> 4d95010a42c2c0af4d75bfe1c44ddfe334268194

  return (
    <div className="service-re-ale-page">
      <div className="service-re-ale-container">
<<<<<<< HEAD
        <h2 className="service-re-ale-title">Service Requests & Alerts</h2>
        <div className="service-re-ale-tabs">
          <button className="service-re-ale-tab active">User Generated</button>
          <button className="service-re-ale-tab">Device Triggered</button>
          <button className="service-re-ale-tab">Sensor Alerts</button>
        </div>
=======
        <div className="service-re-ale-header">
          <h2 className="service-re-ale-title">Service Requests & Alerts</h2>
          <div className="service-re-ale-actions">
            <div className="service-re-ale-search-bar-container">
              <input
                type="text"
                className="input-ser-ale-search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="service-ale-re-search-icon">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
            <button className="service-req-ale-filter-button">
              <FontAwesomeIcon icon={faSliders} />
            </button>
          </div>
        </div>

        <div className="service-re-ale-tabs">
          <button
            className={`service-re-ale-tab left ${activeTab === "User Generated" ? "active" : ""}`}
            onClick={() => setActiveTab("User Generated")}
          >
            User Generated
          </button>
          <button
            className={`service-re-ale-tab center ${activeTab === "Device Triggered" ? "active" : ""}`}
            onClick={() => setActiveTab("Device Triggered")}
          >
            Device Triggered
          </button>
          <button
            className={`service-re-ale-tab right ${activeTab === "Sensor Alerts" ? "active" : ""}`}
            onClick={() => setActiveTab("Sensor Alerts")}
          >
            Sensor Alerts
          </button>
        </div>

>>>>>>> 4d95010a42c2c0af4d75bfe1c44ddfe334268194
        <table className="service-re-ale-table">
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
<<<<<<< HEAD
            {requests.map((req) => (
              <tr key={req.id}>
=======
            {filteredAlerts.map((req) => (
              <tr key={req.id} onClick={() => handleRowClick(req.id)}>
>>>>>>> 4d95010a42c2c0af4d75bfe1c44ddfe334268194
                <td>{req.id}</td>
                <td>{req.type}</td>
                <td>{req.device}</td>
                <td>{req.sector}</td>
                <td>
                  <button className="service-re-ale-edit">Edit</button>
                  <button className="service-re-ale-deploy">Deploy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
<<<<<<< HEAD
  
};

export default ServiceRequestsAlerts;
=======
};

export default ServiceAlerts;
>>>>>>> 4d95010a42c2c0af4d75bfe1c44ddfe334268194
