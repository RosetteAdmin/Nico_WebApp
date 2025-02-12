import React from "react";
import "./ServiceRequestsAlerts.css";

const ServiceRequestsAlerts = () => {
  const requests = [
    { id: "00001", type: "User Generated", device: "NICO", sector: "Karnataka" },
    { id: "00002", type: "User Generated", device: "Fishery Dept", sector: "Kerala" },
    { id: "00003", type: "System Generated", device: "XYZAB", sector: "Pune" },
    { id: "00004", type: "System Generated", device: "Delhi Zoo", sector: "New Delhi" },
  ];

  return (
    <div className="service-re-ale-page">
      <div className="service-re-ale-container">
        <h2 className="service-re-ale-title">Service Requests & Alerts</h2>
        <div className="service-re-ale-tabs">
          <button className="service-re-ale-tab active">User Generated</button>
          <button className="service-re-ale-tab">Device Triggered</button>
          <button className="service-re-ale-tab">Sensor Alerts</button>
        </div>
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
            {requests.map((req) => (
              <tr key={req.id}>
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
  
};

export default ServiceRequestsAlerts;
