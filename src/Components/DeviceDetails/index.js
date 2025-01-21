import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DeviceDetails.css";

const DeviceDetails = () => {
  const { id } = useParams(); // Get the device ID from the URL
  const [deviceData, setDeviceData] = useState({
    nbGenerator: {
      flowRate: '',
      pressure: '',
      waterTemperature: '',
      systemTemperature: '',
      totalWaterOutlet: ''
    },
    ozoneGenerator: {
      flowRate: '',
      pressure: '',
      waterTemperature: '',
      systemTemperature: '',
      totalWaterOutlet: ''
    },
    oxygenGenerator: {
      flowRate: '',
      pressure: '',
      waterTemperature: '',
      systemTemperature: '',
      totalWaterOutlet: ''
    }
  });

  const [nbGeneratorPower, setNbGeneratorPower] = useState(false); // State for NB generator power status
  const [loading, setLoading] = useState(false); // State for loading screen
  const ozoneGeneratorPower = false; // State for Ozone generator power status
  const oxygenGeneratorPower = false; // State for Oxygen generator power status

  // Fetch the initial state of nbGeneratorPower
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/get/${id}-nb`);
        const data = await response.json();
        if (data.status === 'success') {
          setNbGeneratorPower(data.data);
        } else {
          console.error('Failed to fetch initial state:', data.message);
        }
      } catch (error) {
        console.error('Error fetching initial state:', error);
      }
    };

    fetchInitialState();
  }, [id]);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`)
        .then(response => response.json()).then(setLoading(false))
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
        })
        .catch(error => console.error('Error fetching device data:', error));
    };

    if (nbGeneratorPower) {
      fetchData(); // Fetch data immediately on mount
      const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [id, nbGeneratorPower]);

  const handlePowerToggle = () => {
    const newPowerStatus = !nbGeneratorPower;
    setLoading(true); // Show loading screen

    // Make an API call to update the power status
    fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json()).then(setNbGeneratorPower(newPowerStatus))
      .then(data => {
        alert(`Power status updated: ${nbGeneratorPower ? 'Powered Off' : 'Powered On'}`);
        setLoading(false); // Hide loading screen
      })
      .catch(error => {
        alert('Error updating power status:', error);
        setLoading(false); // Hide loading screen
      });
    
      // Make a second API call to set the power status
    fetch(`${process.env.REACT_APP_EP}/api/devices/set/${id}-nb`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error setting power status:', error);
      });
  };

  return (
    <div className="device-detail-container">
      {loading && (
      <div className="loading-backdrop">
        <div className="loading-spinner"></div>
        <div className="loading-text">Waiting for device...</div>
      </div>
      )}
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
            <span>
              {nbGeneratorPower 
                ? `On from: ${new Date(deviceData.nbGenerator.timestamp).toLocaleString()}` 
                : 'Powered Off'}
            </span>              <label className="toggle-switch">
              <input type="checkbox" checked={nbGeneratorPower} onChange={handlePowerToggle} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="power-item">
            <span>Ozone Generator</span>
            <div className="power-toggle">
            <span>
              {ozoneGeneratorPower 
                ? `On from: ${new Date(deviceData.ozoneGenerator.timestamp).toLocaleString()}` 
                : 'Powered Off'}
            </span>              
            <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="power-item">
            <span>Oxygen Generator</span>
            <div className="power-toggle">
            <span>
              {oxygenGeneratorPower 
                ? `On from: ${new Date(deviceData.oxygenGenerator.timestamp).toLocaleString()}` 
                : 'Powered Off'}
            </span>              
            <label className="toggle-switch">
                <input type="checkbox" />
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
              <p><strong>Water Flow Rate:</strong> {deviceData.nbGenerator.flowRate || 'N/A'}</p>
              <p><strong>Water Pressure:</strong> {deviceData.nbGenerator.pressure || 'N/A'}</p>
              <p><strong>Water Temperature:</strong> {deviceData.nbGenerator.waterTemperature || 'N/A'}</p>
              <p><strong>System Temperature:</strong> {deviceData.nbGenerator.systemTemperature || 'N/A'}</p>
              <p><strong>Total Water Outlet:</strong> {deviceData.nbGenerator.totalWaterOutlet || 'N/A'}</p>
            </div>
            <div className="sensor-item">
              <h4>Oxygen Generator</h4>
              <p><strong>Water Flow Rate:</strong> {deviceData.ozoneGenerator.flowRate || 'N/A'}</p>
              <p><strong>Water Pressure:</strong> {deviceData.ozoneGenerator.pressure || 'N/A'}</p>
              <p><strong>Water Temperature:</strong> {deviceData.ozoneGenerator.waterTemperature || 'N/A'}</p>
              <p><strong>System Temperature:</strong> {deviceData.ozoneGenerator.systemTemperature || 'N/A'}</p>
              <p><strong>Total Water Outlet:</strong> {deviceData.ozoneGenerator.totalWaterOutlet || 'N/A'}</p>
            </div>
            <div className="sensor-item">
              <h4>Ozone Generator</h4>
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
  );
};

export default DeviceDetails;
