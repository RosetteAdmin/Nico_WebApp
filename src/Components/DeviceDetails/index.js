import React from "react";
import { useParams } from "react-router-dom";
import "./DeviceDetails.css";

const DeviceDetails = () => {
  const { id } = useParams(); // Get the device ID from the URL

  return (
    <div className="device-detail-container">
      <h2>Devices</h2>

      {/* Basic Info Section */}
      <div className="device-info-card">
        <div>
          <h3 className="section-title">Device Basic Information:</h3>
          <p><strong>Device Name:</strong> Random_Name</p>
          <p><strong>Device ID:</strong> NICO{id}</p>
          <p><strong>Owner Name:</strong> Random_Name</p>
          <p><strong>Owner Phone:</strong> 90354651234</p>
          <p><strong>Device Sector:</strong> Karnataka</p>
        </div>
      </div>

      {/* Connection Info Section */}
      <div className="device-info-card">
        <div>
          <h3 className="section-title">Device Connection Status and Subscriptions:</h3>
          <p><strong>Connection Status:</strong> Connected via Wi-Fi</p>
          <p><strong>Subscription Status:</strong> Valid till 24 January 2025</p>
        </div>
      </div>

      {/* Power Status Section */}
      <div className="device-info-card device-power-status">
        <div>
          <h3 className="section-title">
            Device Power Status:
            <a href="/logs" className="view-logs-link">View Previous Power Logs</a>
          </h3>
          <div className="power-item">
            <span>NB Generator</span>
            <div className="power-toggle">
              <span>On from: 12:48:39 PM 25 Oct 2024 (32 hours ago)</span>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="power-item">
            <span>Ozone Generator</span>
            <div className="power-toggle">
              <span>Off from: 06:56:34 PM 25 Oct 2024 (8 hours ago)</span>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="power-item">
            <span>NB Generator</span>
            <div className="power-toggle">
              <span>On from: 12:48:39 PM 25 Oct 2024 (32 hours ago)</span>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Data Section */}
      <div className="device-info-card">
        <div>
          <h3 className="section-title">Sensor Data:</h3>
          <div className="sensor-data">
            <div className="sensor-item">
              <h4>NB Generator</h4>
              <p><strong>Water Flow Rate:</strong> 25 L/min</p>
              <p><strong>Water Pressure:</strong> 30 bar</p>
              <p><strong>System Temperature:</strong> 34°C</p>
              <p><strong>Water Temperature:</strong> 28°C</p>
              <p><strong>Total Water Outlet:</strong> 4000 L</p>
            </div>
            <div className="sensor-item">
              <h4>Oxygen Generator</h4>
              <p><strong>Water Flow Rate:</strong> 25 L/min</p>
              <p><strong>Water Pressure:</strong> 30 bar</p>
              <p><strong>System Temperature:</strong> 34°C</p>
              <p><strong>Water Temperature:</strong> 28°C</p>
              <p><strong>Total Water Outlet:</strong> 4000 L</p>
            </div>
            <div className="sensor-item">
              <h4>Ozone Generator</h4>
              <p><strong>Water Flow Rate:</strong> 25 L/min</p>
              <p><strong>Water Pressure:</strong> 30 bar</p>
              <p><strong>System Temperature:</strong> 34°C</p>
              <p><strong>Water Temperature:</strong> 28°C</p>
              <p><strong>Total Water Outlet:</strong> 4000 L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Alert and Info History Section */}
      <div className="device-info-card">
        <div>
          <h3 className="section-title">Device Alert and Info History:</h3>
          <table className="alert-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Descriptions</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>18/03/24</td>
                <td>Subscriptions</td>
                <td>Subscriptions ends in 15 days</td>
                <td>Info</td>
              </tr>
              <tr>
                <td>23/02/24</td>
                <td>Services</td>
                <td>Yearly Service Notification</td>
                <td>Info</td>
              </tr>
              <tr>
                <td>08/01/24</td>
                <td>Device Disconnected</td>
                <td>Device is out of Connection</td>
                <td>Alert</td>
              </tr>
              <tr>
                <td>08/01/24</td>
                <td>Sensor Outage</td>
                <td>Data reached Sensor limits</td>
                <td>Alert</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
