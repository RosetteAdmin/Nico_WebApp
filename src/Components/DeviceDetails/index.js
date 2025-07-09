import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DeviceDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faLink, faPencil,faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import svg1 from "./../../Images/Dashboard/Icon.svg";


const DeviceDetails = () => {
  const { id } = useParams(); // Get the device ID from the URL
  const [deviceData, setDeviceData] = useState({
    nbGenerator: {
      flowRate: '',
      pressure: '',
      waterTemperature: '',
      systemTemperature: '',
      totalWaterOutlet: '',
      timestamp: ''
    },
    ozoneGenerator: {
      flowRate: '',
      pressure: '',
      waterTemperature: '',
      systemTemperature: '',
      totalWaterOutlet: '',
      timestamp: ''
    },
    oxygenGenerator: {
      flowRate: '',
      pressure: '',
      waterTemperature: '',
      systemTemperature: '',
      totalWaterOutlet: '',
      timestamp: ''
    }
  });

  const [nbGeneratorPower, setNbGeneratorPower] = useState(false);
  const [ozoneGeneratorPower, setOzoneGeneratorPower] = useState(false);
  const [oxygenGeneratorPower, setOxygenGeneratorPower] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conn, setConn] = useState(false);
  
  // Add states to track which switches are currently waiting for update
  const [nbWaiting, setNbWaiting] = useState(false);
  const [ozoneWaiting, setOzoneWaiting] = useState(false);
  const [oxygenWaiting, setOxygenWaiting] = useState(false);
  
  // Add timestamps for when toggle requests were made
  const [nbRequestTime, setNbRequestTime] = useState(0);
  const [ozoneRequestTime, setOzoneRequestTime] = useState(0);
  const [oxygenRequestTime, setOxygenRequestTime] = useState(0);

  // Check connection status once on mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'Connected') {
          setConn(true);
        } else {
          setConn(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching device status:', error);
        setLoading(false);
        setConn(false);
      });
  }, [id]);

  // Fetch device data at regular intervals if connected
  useEffect(() => {
    // Only fetch data if connection is established
    if (!conn) return;
    
    const fetchData = () => {
      fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setDeviceData({
            nbGenerator: {
              flowRate: data.nbGenerator.flowRate,
              pressure: data.nbGenerator.pressure,
              waterTemperature: data.nbGenerator.waterTemperature,
              systemTemperature: data.nbGenerator.systemTemperature,
              totalWaterOutlet: data.nbGenerator.totalWaterOutlet,
              timestamp: data.nbGenerator.timestamp
            },
            ozoneGenerator: {
              flowRate: data.ozoneGenerator.flowRate,
              pressure: data.ozoneGenerator.pressure,
              waterTemperature: data.ozoneGenerator.waterTemperature,
              systemTemperature: data.ozoneGenerator.systemTemperature,
              totalWaterOutlet: data.ozoneGenerator.totalWaterOutlet,
              timestamp: data.ozoneGenerator.timestamp
            },
            oxygenGenerator: {
              flowRate: data.oxygenGenerator.flowRate,
              pressure: data.oxygenGenerator.pressure,
              waterTemperature: data.oxygenGenerator.waterTemperature,
              systemTemperature: data.oxygenGenerator.systemTemperature,
              totalWaterOutlet: data.oxygenGenerator.totalWaterOutlet,
              timestamp: data.oxygenGenerator.timestamp
            }
          });
          
          // Get the current timestamp for comparison
          const currentTime = Date.now();
          const timeoutThreshold = 15000; // 10 seconds timeout
          
          // Clear waiting states based on timestamps or when status changes
          // NB Generator
          if (nbWaiting && (
              data.nbGenerator.nbStatus !== nbGeneratorPower || 
              currentTime - nbRequestTime > timeoutThreshold
          )) {
            setNbWaiting(false);
          }
          
          // Ozone Generator
          if (ozoneWaiting && (
              data.ozoneGenerator.O3Status !== ozoneGeneratorPower || 
              currentTime - ozoneRequestTime > timeoutThreshold
          )) {
            setOzoneWaiting(false);
          }
          
          // Oxygen Generator
          if (oxygenWaiting && (
              data.oxygenGenerator.O2Status !== oxygenGeneratorPower || 
              currentTime - oxygenRequestTime > timeoutThreshold
          )) {
            setOxygenWaiting(false);
          }

          // Update power states
          setNbGeneratorPower(data.nbGenerator.nbStatus);
          setOzoneGeneratorPower(data.ozoneGenerator.O3Status);
          setOxygenGeneratorPower(data.oxygenGenerator.O2Status);
          
        })
        .catch(error => {
          console.error('Error fetching device data:', error);
          // Clear waiting states in case of error to prevent UI from being stuck
          setNbWaiting(false);
          setOzoneWaiting(false);
          setOxygenWaiting(false);
        });
    };

    fetchData(); // Fetch data immediately when connected
    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    
    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [id, conn, nbGeneratorPower, ozoneGeneratorPower, oxygenGeneratorPower, nbWaiting, ozoneWaiting, oxygenWaiting, nbRequestTime, ozoneRequestTime, oxygenRequestTime]);

  const handlePowerToggle = (type) => {
    const currentTime = Date.now();
    
    // Set the appropriate waiting state and request time
    switch(type) {
      case "nb":
        setNbWaiting(true);
        setNbRequestTime(currentTime);
        break;
      case "o3":
        setOzoneWaiting(true);
        setOzoneRequestTime(currentTime);
        break;
      case "o2":
        setOxygenWaiting(true);
        setOxygenRequestTime(currentTime);
        break;
      default:
        return;
    }
    
    // Make an API call to update the power status
    fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error updating power status:', error);
        alert('Error updating power status. Please try again.');
        
        // Clear the waiting state in case of error
        switch(type) {
          case "nb":
            setNbWaiting(false);
            break;
          case "o3":
            setOzoneWaiting(false);
            break;
          case "o2":
            setOxygenWaiting(false);
            break;
          default:
            return;
        }
      });
  };

  // Helper function to get status text with waiting indicator
  const getStatusText = (isPowered, timestamp, isWaiting) => {
    if (isWaiting) {
      return "Waiting for update...";
    } else if (isPowered) {
      return `Last received: ${new Date(timestamp).toLocaleString()}`;
    } else {
      return 'Powered Off';
    }
  };

  return (
    <>
    <div className="device-details-banner">
  <div className="device-details-header">
    <h2 className="device-details-title">
      <strong>Device Name || </strong><span className="device-name">NICO{id}</span>
    </h2>
    <div className="device-details-status">
    <span className="device-connection-status">
      <FontAwesomeIcon
          icon={faLink}
          className={`status-icon ${conn ? 'green' : 'red'}`}
        />
      {conn  ? 'Connected' : 'Disconnected'}
    </span>


    <span className={`connection-badge ${nbGeneratorPower ? 'on' : 'off'}`}>
        {nbGeneratorPower ? 'ON' : 'OFF'}
      </span>
      <span className={`connection-label ${nbGeneratorPower ? 'green' : 'red'}`}>
        {nbGeneratorPower ? 'Power ON' : 'Power OFF'}
      </span>



  </div>
  </div>
  {conn && (
        <div className="device-power-status-banner">
          <span className={`power-badge ${nbGeneratorPower ? 'on' : 'off'}`}>
            {nbGeneratorPower ? 'ON' : 'OFF'}
          </span>
          <span className={`power-label ${nbGeneratorPower ? 'green' : 'red'}`}>
            {nbGeneratorPower ? 'Power ON' : 'Power OFF'}
          </span>
        </div>
      )}
</div>


    {loading && (
      <div className="loading-backdrop">
        <div className="loading-spinner"></div>
        <div className="loading-text">Waiting for device...</div>
      </div>
    )}
    { !loading && !conn &&
    <div className="device-detail-disconnected">
      <div className="device-detail-content">
        <svg className="device-detail-icon" size={80} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h.01"/>
          <path d="M8.5 16.429a5 5 0 0 1 7 0"/>
          <path d="M5 12.859a10 10 0 0 1 5.17-2.69"/>
          <path d="M19 12.859a10 10 0 0 0-2.007-1.523"/>
          <path d="M2 8.82a15 15 0 0 1 4.177-2.643"/>
          <path d="M22 8.82a15 15 0 0 0-11.288-3.764"/>
          <path d="m2 2 20 20"/>
        </svg>
        <h1 className="device-disconnected-h1">Device Disconnected</h1>
        <p className="device-disconnected-p">Please check the device's connection and try again.</p>
      </div>
    </div> }

    
    { !loading && conn &&
    <div className="device-detail-container">
      

      {/* Basic Info Section */}
      <div className="device-info-card">
  <div className="device-info-header">
    <h3 className="section-title">Device Basic Information:</h3>
    <button className="editt-btn">
      <FontAwesomeIcon icon={faPencil} />Edit
    </button>
  </div>

  <div className="device-info-grid">
    <p><strong>Device Name:</strong> Random_Name</p>
    <p><strong>Owner Name:</strong> Random_Name</p>
    <p><strong>Owner Phone:</strong> 90354651234</p>
    <p><strong>Device ID:</strong> NICO{id}</p>
    <p><strong>Owner Email ID:</strong> Email ID</p>
    <p><strong>Device Sector:</strong> Karnataka</p>
  </div>
  </div>


      {/* Connection Info Section */}
      <div className="device-info-card">
        <div>
          <h3 className="section-title">Device Connection Status and Subscriptions:</h3>
            <div className="device-connection-grid">

          <p><strong>Connection Status:</strong> Connected via Wi-Fi</p>
          <p><strong>Subscription Status:</strong> Valid till 24 January 2025</p>
        </div>
        </div>
      </div>

      {/* Power Status Section */}
      <div className="device-info-card device-power-status">
        <div>
          <h3 className="section-title">
            Device Power Status:
            <a href="/logs" className="view-logs-link"><img src={svg1} alt="View Logs" />
            View Previous Power Logs</a>
          </h3>
          <div className="power-item">
            <span>NB Generator</span>
            <div className="power-toggle">
              <span className={nbWaiting ? "status-waiting" : ""}>
                {getStatusText(nbGeneratorPower, deviceData.nbGenerator.timestamp, nbWaiting)}
              </span>
              <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
                <input 
                  type="checkbox" 
                  checked={nbGeneratorPower} 
                  onChange={() => !nbWaiting && handlePowerToggle("nb")} 
                  disabled={nbWaiting}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="power-item">
            <span>Ozone Generator</span>
            <div className="power-toggle">
              <span className={ozoneWaiting ? "status-waiting" : ""}>
                {getStatusText(ozoneGeneratorPower, deviceData.ozoneGenerator.timestamp, ozoneWaiting)}
              </span>              
              <label className={`toggle-switch ${ozoneWaiting ? "toggle-waiting" : ""}`}>
                <input 
                  type="checkbox" 
                  checked={ozoneGeneratorPower} 
                  onChange={() => !ozoneWaiting && handlePowerToggle("o3")}
                  disabled={ozoneWaiting}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="power-item">
            <span>Oxygen Generator</span>
            <div className="power-toggle">
              <span className={oxygenWaiting ? "status-waiting" : ""}>
                {getStatusText(oxygenGeneratorPower, deviceData.oxygenGenerator.timestamp, oxygenWaiting)}
              </span>              
              <label className={`toggle-switch ${oxygenWaiting ? "toggle-waiting" : ""}`}>
                <input 
                  type="checkbox" 
                  checked={oxygenGeneratorPower} 
                  onChange={() => !oxygenWaiting && handlePowerToggle("o2")}
                  disabled={oxygenWaiting}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Data Section */}
      <div className="device-info-card">
        <div>
          <h3 className="section-title">Sensor Data:
            <a href={`/device/${id}/logdetails`} className="view-logs-link"><img src={svg1} alt="View Logs" />
                  View Previous Power Logs</a>
          </h3>

          <div className="sensor-data">
            <div className="sensor-item">
              <h4>NB Generator</h4>
              <p><strong>Water Flow Rate:</strong> {deviceData.nbGenerator.flowRate || 'N/A'}</p>
              <p><strong>Water Pressure:</strong> {deviceData.nbGenerator.pressure || 'N/A'}</p>
              <p><strong>Water Temperature:</strong> {deviceData.nbGenerator.waterTemperature || 'N/A'}</p>
              <p><strong>System Temperature:</strong> {deviceData.nbGenerator.systemTemperature || 'N/A'}</p>
              <p><strong>Total Water Outlet:</strong> {deviceData.nbGenerator.totalWaterOutlet || 'N/A'}</p>
            </div>
            <div className="sensor-item">
              <h4>Ozone Generator</h4>
              <p><strong>Water Flow Rate:</strong> {deviceData.ozoneGenerator.flowRate || 'N/A'}</p>
              <p><strong>Water Pressure:</strong> {deviceData.ozoneGenerator.pressure || 'N/A'}</p>
              <p><strong>Water Temperature:</strong> {deviceData.ozoneGenerator.waterTemperature || 'N/A'}</p>
              <p><strong>System Temperature:</strong> {deviceData.ozoneGenerator.systemTemperature || 'N/A'}</p>
              <p><strong>Total Water Outlet:</strong> {deviceData.ozoneGenerator.totalWaterOutlet || 'N/A'}</p>
            </div>
            <div className="sensor-item">
              <h4>Oxygen Generator</h4>
              <p><strong>Flow Rate:</strong> {deviceData.oxygenGenerator.flowRate || 'N/A'}</p>
              <p><strong>Pressure:</strong> {deviceData.oxygenGenerator.pressure || 'N/A'}</p>
              <p><strong>Water Temperature:</strong> {deviceData.oxygenGenerator.waterTemperature || 'N/A'}</p>
              <p><strong>System Temperature:</strong> {deviceData.oxygenGenerator.systemTemperature || 'N/A'}</p>
              <p><strong>Total Water Outlet:</strong> {deviceData.oxygenGenerator.totalWaterOutlet || 'N/A'}</p>
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
    }
    </>
  );
};

export default DeviceDetails;