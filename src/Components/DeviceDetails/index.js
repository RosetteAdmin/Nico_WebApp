  import React, { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { useNavigate } from 'react-router-dom';
  import "./DeviceDetails.css";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import DeviceCharts from "../DataChart";
  import { faLink, faPencil, faCheck, faSave,faRotate  } from "@fortawesome/free-solid-svg-icons";
  import { faPenToSquare, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
  import axios from "axios";

  const DeviceDetails = () => {
    const { id } = useParams();

    // Device name and owner info
    // Add after nbWaiting state
    const [powerStatusHistory, setPowerStatusHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [autoWaiting, setAutoWaiting] = useState(false);
    const [deviceName, setDeviceName] = useState("Loading...");
    const [deviceInfo, setDeviceInfo] = useState({
      owner_name: "Loading...",
      phone_number: "Loading...",
      email_id: "Loading...",
      location: "Loading...",
    });

    // Edit mode states
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableInfo, setEditableInfo] = useState({
      owner_name: "",
      phone_number: "",
      email_id: "",
      location: ""
    });

    // Editing states for config inputs
    const [isWriting, setIsWriting] = useState({
      counter: false,
      onTime: false,
      offTime: false
    });


  // Success states for green button feedback
  const [writeSuccess, setWriteSuccess] = useState({
    counter: false,
    onTime: false,
    offTime: false
  });

  // Last written values for placeholder
  const [lastWritten, setLastWritten] = useState({
    counter: "",
    onTime: "",
    offTime: ""
  });


    const navigate = useNavigate();



    // Fetch power status history
const fetchPowerStatusHistory = async () => {
  if (!conn) return;
  
  setLoadingHistory(true);
  try {
    const response = await fetch(
      `${process.env.REACT_APP_EP}/data/devices/${id}/power-status-history?limit=20`
    );
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    if (data.status === 'success') {
      setPowerStatusHistory(data.data);
    }
  } catch (error) {
    console.error('Error fetching power status history:', error);
  } finally {
    setLoadingHistory(false);
  }
};

    // Function to fetch device data manually
    const fetchDeviceData = async () => {
      if (!conn) return;
      
      try {
        // Fetch telemetry for display data - NOW FROM DATABASE
        const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
        if (!telemetryRes.ok) throw new Error(`HTTP ${telemetryRes.status}`);
        const data = await telemetryRes.json();

        // Update device data with fallback to prevent null/undefined
        setDeviceData({
          nbGenerator: { 
            ...data.nbGenerator,
            // Ensure all values have defaults (never null/undefined)
            pump_motor_frequency: data.nbGenerator.pump_motor_frequency ?? 0,
            pump_motor_current: data.nbGenerator.pump_motor_current ?? 0,
            total_running_hours: data.nbGenerator.total_running_hours ?? 0,
            auto_sequence_on_time: data.nbGenerator.auto_sequence_on_time ?? 0,
            auto_sequence_off_time: data.nbGenerator.auto_sequence_off_time ?? 0,
            auto_sequence_counter: data.nbGenerator.auto_sequence_counter ?? 0,
            alert_status: data.nbGenerator.alert_status ?? 0
          },
          ozoneGenerator: { ...data.ozoneGenerator },
          oxygenGenerator: { ...data.oxygenGenerator },
        });

        // Use the check-power endpoint for real-time status (UNCHANGED)
        const currentPowerStatus = await checkPowerStatus();
        
        if (currentPowerStatus !== null) {
          // Use the Azure IoT endpoint result
          if (currentPowerStatus !== isPowerOn) {
            setIsPowerOn(currentPowerStatus);
            console.log(`Power status changed via Azure IoT: ${currentPowerStatus ? 'ON (57)' : 'OFF (1)'}`);
          }
        } else {
          // Fallback to telemetry alert_status if endpoint fails
          const fallbackStatus = data.nbGenerator?.alert_status === 57;
          if (fallbackStatus !== isPowerOn) {
            setIsPowerOn(fallbackStatus);
            console.log(`Power status changed (fallback) - Alert Status: ${data.nbGenerator?.alert_status}, Power: ${fallbackStatus ? 'ON' : 'OFF'}`);
          }
        }

        // Clear waiting after confirmation
        if (nbWaiting) {
          setNbWaiting(false);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
        setNbWaiting(false);
      }
    };

    // Function to write to registers (UNCHANGED)
    // UPDATED: Function to write to registers - removed alerts, added green button feedback
  const writeToRegister = async (registerType, value) => {
    if (!value || value === '') {
      return false;
    }

    const fieldMap = {
      'auto_sequence_counter': 'counter',
      'auto_sequence_on': 'onTime',
      'auto_sequence_off': 'offTime'
    };
    
    const fieldName = fieldMap[registerType];
    setIsWriting(prev => ({ ...prev, [fieldName]: true }));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_EP}/api/devices/${id}/write-register`,
        {
          registerType: registerType,
          value: parseInt(value)
        }
      );

      if (response.data.success) {
        // Set success state for green button
        setWriteSuccess(prev => ({ ...prev, [fieldName]: true }));
        
        // Store last written value for placeholder
        setLastWritten(prev => ({ ...prev, [fieldName]: value }));
        
        // Clear the input value
        switch(registerType) {
          case 'auto_sequence_counter':
            setCounter('');
            break;
          case 'auto_sequence_on':
            setOnTime('');
            break;
          case 'auto_sequence_off':
            setOffTime('');
            break;
        }
        
        // Remove green state after 5 seconds
        setTimeout(() => {
          setWriteSuccess(prev => ({ ...prev, [fieldName]: false }));
        }, 5000);
        
        // Refresh data after successful write
        await fetchDeviceData();
        
        return true;
      }
    } catch (error) {
      console.error('Error writing to register:', error);
      return false;
    } finally {
      setIsWriting(prev => ({ ...prev, [fieldName]: false }));
    }
  };

    // Handler functions (UNCHANGED)
    const handleCounterClick = async () => {
      if (counter) {
        await writeToRegister('auto_sequence_counter', counter);
      } 
    };

    const handleOnTimeClick = async () => {
      if (onTime) {
        await writeToRegister('auto_sequence_on', onTime);
      } 
    };

    // power status update (UNCHANGED)
    const checkPowerStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/check-power`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          console.log(`Power Status Check:`, {
            device: id,
            status_value: data.status_value,
            power: data.power ? 'ON' : 'OFF',
            source: data.source || 'azure',
            timestamp: data.timestamp
          });
          
          return data.power;
        }
        
        return null;
      } catch (error) {
        console.error('Error checking power status:', error);
        return null;
      }
    };

    const handleOffTimeClick = async () => {
      if (offTime) {
        await writeToRegister('auto_sequence_off', offTime);
      } 
    };

    // Telemetry structure
    const [deviceData, setDeviceData] = useState({
      nbGenerator: {
        flowRate: "",
        pressure: "",
        waterTemperature: "",
        systemTemperature: "",
        totalWaterOutlet: "",
        pump_motor_frequency: 0,
        pump_motor_current: 0,
        total_running_hours: 0,
        auto_sequence_on_time: 0,
        auto_sequence_off_time: 0,
        auto_sequence_counter: 0,
        alert_status: 0,
        timestamp: "",
      },
      ozoneGenerator: {
        flowRate: "",
        pressure: "",
        waterTemperature: "",
        systemTemperature: "",
        totalWaterOutlet: "",
        timestamp: "",
      },
      oxygenGenerator: {
        flowRate: "",
        pressure: "",
        waterTemperature: "",
        systemTemperature: "",
        totalWaterOutlet: "",
        timestamp: "",
      },
    });

    // Connection/loading
    const [loading, setLoading] = useState(true);
    const [conn, setConn] = useState(false);

    // Waiting flags for toggle
    const [nbWaiting, setNbWaiting] = useState(false);

    // Config panel states
    const [autoMode, setAutoMode] = useState(false);
    const [onTime, setOnTime] = useState("");
    const [offTime, setOffTime] = useState("");
    const [counter, setCounter] = useState("");

    // Master gate for charts/polling
    const [isPowerOn, setIsPowerOn] = useState(false);

    // NEW: Handle edit/save toggle
    const handleEditToggle = async () => {
      if (isEditMode) {
        // Save mode - validate and update
        if (!editableInfo.email_id || !editableInfo.owner_name) {
          alert("Please fill in both owner name and email fields");
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (editableInfo.email_id !== "N/A" && !emailRegex.test(editableInfo.email_id)) {
          alert("Please enter a valid email address");
          return;
        }

        const confirmUpdate = window.confirm("Are you sure you want to update this device?");
        if (!confirmUpdate) return;

        setLoading(true);

        try {
          const response = await fetch(`${process.env.REACT_APP_EP}/data/updatedevice`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              azure_device_id: id,
              owner_name: editableInfo.owner_name,
              email_id: editableInfo.email_id,
              phone_number: editableInfo.phone_number,
              location: editableInfo.location
            }),
          });

          const result = await response.json();

          if (result.status === "success") {
            alert("Device updated successfully!");
            setDeviceInfo(editableInfo);
            setIsEditMode(false);
          } else {
            alert(`Failed to update device: ${result.message}`);
          }
        } catch (error) {
          console.error("Error updating device:", error);
          alert("Failed to update device. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        // Enter edit mode
        setIsEditMode(true);
      }
    };

    // NEW: Handle input changes in edit mode
    const handleInputChange = (field, value) => {
      setEditableInfo(prev => ({
        ...prev,
        [field]: value
      }));
    };

    // Owner/misc info - UPDATED to also set editableInfo
    useEffect(() => {
      fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch device info");
          return r.json();
        })
        .then((resp) => {
          if (resp.status === "success" && resp.data) {
            const { owner_name, phone_number, email_id, location } = resp.data;
            const info = {
              owner_name: owner_name || "N/A",
              phone_number: phone_number || "N/A",
              email_id: email_id || "N/A",
              location: location || "N/A",
            };
            setDeviceInfo(info);
            setEditableInfo(info);
          } else {
            throw new Error("Invalid data structure from API");
          }
        })
        .catch(() => {
          setDeviceName("Error");
          const errorInfo = {
            owner_name: "N/A",
            phone_number: "N/A",
            email_id: "N/A",
            location: "N/A",
          };
          setDeviceInfo(errorInfo);
          setEditableInfo(errorInfo);
        });
    }, [id]);

    // Device list → deviceName (UNCHANGED)
    useEffect(() => {
      let cancelled = false;
      fetch(`${process.env.REACT_APP_EP}/api/devices`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((payload) => {
          const list = Array.isArray(payload) ? payload : payload.value || [];
          const dev = (list || []).find((d) => String(d.id) === String(id));
          if (!cancelled) setDeviceName(dev ? dev.displayName || dev.name || "N/A" : "N/A");
        })
        .catch(() => {
          if (!cancelled) setDeviceName("Error");
        });
      return () => {
        cancelled = true;
      };
    }, [id]);

    // Connection status and initial power check (UNCHANGED)
    useEffect(() => {
      const fetchInitialStatus = async () => {
        try {
          // Fetch connection status
          const statusRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`);
          if (!statusRes.ok) throw new Error(`HTTP ${statusRes.status}`);
          const statusData = await statusRes.json();
          
          setConn(statusData.status === "Connected");
          
          // If connected, use the new check-power endpoint
          if (statusData.status === "Connected") {
            const powerStatus = await checkPowerStatus();
            if (powerStatus !== null) {
              setIsPowerOn(powerStatus);
              console.log(`Initial power status via Azure IoT: ${powerStatus ? 'ON (57)' : 'OFF (1)'}`);
            } else {
              // Fallback to telemetry if new endpoint fails
              const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
              if (telemetryRes.ok) {
                const data = await telemetryRes.json();
                const powerStatus = data.nbGenerator?.alert_status === 57;
                setIsPowerOn(powerStatus);
                console.log(`Initial power status (fallback) - Alert Status: ${data.nbGenerator?.alert_status}, Power: ${powerStatus ? 'ON' : 'OFF'}`);
              }
            }
          }
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching initial status:", error);
          setConn(false);
          setIsPowerOn(false);
          setLoading(false);
        }
      };

      fetchInitialStatus();
    }, [id]);

    // Fetch device data once when connection is established (UNCHANGED)
    useEffect(() => {
      if (conn) {
        fetchDeviceData();
        fetchPowerStatusHistory();
      }
    }, [conn]);

    const handlePowerToggle = async () => {
      const desired = !isPowerOn;

      setNbWaiting(true);

      if (!conn) {
        setNbWaiting(false);
        return;
      }

      // Optimistic UI update
      setIsPowerOn(desired);

      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/nb`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: desired ? "on" : "off" }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        await response.json();
        console.log(`Toggle command sent: ${desired ? 'ON' : 'OFF'}`);
        
        // Wait a bit for the device to respond, then check status
        setTimeout(async () => {
          await fetchDeviceData();
          await fetchPowerStatusHistory();// Refresh history after toggle
          setNbWaiting(false);
        }, 3000);
        
      } catch (err) {
        console.error("Error updating power status:", err);
        setIsPowerOn(!desired);  // Revert on error
        setNbWaiting(false);
        alert("Error updating power status. Please try again.");
      }
    };


    // Add this new function after handlePowerToggle
  const handleAutoModeToggle = async () => {
    const desired = !autoMode;
    
    setAutoWaiting(true);

    if (!conn || !isPowerOn) {
      setAutoWaiting(false);
      return;
    }

    // Optimistic UI update
    setAutoMode(desired);

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/auto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      await response.json();
      console.log(`Auto mode toggle command sent: ${desired ? 'ON' : 'OFF'}`);
      
      // Wait a bit for the device to respond
      setTimeout(async () => {
        setAutoWaiting(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error toggling auto mode:", err);
      setAutoMode(!desired);  // Revert on error
      setAutoWaiting(false);
      alert("Error toggling auto mode. Please try again.");
    }
  };

  // Handle manual status refresh
  const handleRefreshStatus = async () => {
    if (!conn || isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      const powerStatus = await checkPowerStatus();
      
      if (powerStatus !== null) {
        setIsPowerOn(powerStatus);
        console.log(`Manual refresh - Power status: ${powerStatus ? 'ON (57)' : 'OFF (1)'}`);
        
        // Also refresh device data
        await fetchDeviceData();
      }
      
      // Keep spinning for at least 1 second for visual feedback
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error refreshing status:', error);
      setIsRefreshing(false);
    }
  };


    const getStatusText = (isPowered, timestamp, isWaiting) => {
      if (!conn) return "Disconnected";
      if (isWaiting) return "request sent";
      if (isPowered && isPowerOn) {
        const date = new Date(timestamp);
        const dateStr = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const timeStr = date.toLocaleTimeString();
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        let timeAgo;
        if (diffInDays > 0) timeAgo = `(${diffInDays} day${diffInDays > 1 ? "s" : ""} ago)`;
        else if (diffInHours > 0) timeAgo = `(${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago)`;
        else {
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
          timeAgo = `(${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago)`;
        }
      }
      if (!isPowerOn) return "System OFF";
      return "";
    };

    return (
      <>
        <div className="device-details-banner">
          <div className="device-details-header">
            <h2 className="device-details-title">
              <span className="device-name">{deviceName}</span> ||{" "}
              <span className="device-name">{id}</span>
            </h2>
            <div className="device-details-status">
              <span className="device-connection-status">
                <FontAwesomeIcon icon={faLink} className={`status-icon ${conn ? "green" : "red"}`} />
                {conn ? "Connected" : "Disconnected"}
              </span>
              <span className={`connection-badge ${isPowerOn ? "on" : "off"}`}>{isPowerOn ? "ON" : "OFF"}</span>
              <span className={`connection-label ${isPowerOn ? "green" : "red"}`}>
                {isPowerOn ? "Power ON" : "Power OFF"}
              </span>
            </div>
          </div>
          {conn && (
            <div className="device-power-status-banner">
              <span className={`power-badge ${isPowerOn ? "on" : "off"}`}>{isPowerOn ? "ON" : "OFF"}</span>
              <span className={`power-label ${isPowerOn ? "green" : "red"}`}>{isPowerOn ? "Power ON" : "Power OFF"}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-backdrop">
            <div className="loading-spinner"></div>
            <div className="loading-text">Waiting for device...</div>
          </div>
        )}

        {!loading && (
          <div className="device-detail-container">
            {/* Basic Info - UPDATED with inline editing */}
            <div className="device-info-card">
              <div className="device-info-header">
                <h3 className="section-title">Device Basic Information:</h3>
                <button className="editt-btn" onClick={handleEditToggle}>
                  <FontAwesomeIcon icon={isEditMode ? faSave : faPencil} />
                  {isEditMode ? "Save" : "Edit"}
                </button>
              </div>
              <div className="device-info-grid">
                <p>
                  <strong>Device Name:</strong> {deviceName}
                </p>
                <p className={isEditMode ? "editable-field-container" : ""}>
                  <strong>Owner Name:</strong> 
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editableInfo.owner_name}
                      onChange={(e) => handleInputChange("owner_name", e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    <span>{deviceInfo.owner_name}</span>
                  )}
                </p>
                <p className={isEditMode ? "editable-field-container" : ""}>
                  <strong>Owner Phone:</strong> 
                  {isEditMode ? (
                    <input
                      type="tel"
                      value={editableInfo.phone_number}
                      onChange={(e) => handleInputChange("phone_number", e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    <span>{deviceInfo.phone_number}</span>
                  )}
                </p>
                <p>
                  <strong>Device ID:</strong> {id}
                </p>
                <p className={isEditMode ? "editable-field-container" : ""}>
                  <strong>Owner Email ID:</strong> 
                  {isEditMode ? (
                    <input
                      type="email"
                      value={editableInfo.email_id}
                      onChange={(e) => handleInputChange("email_id", e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    <span>{deviceInfo.email_id}</span>
                  )}
                </p>
                <p className={isEditMode ? "editable-field-container" : ""}>
                  <strong>Device Sector:</strong> 
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editableInfo.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="inline-edit-input"
                    />
                  ) : (
                    <span>{deviceInfo.location}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Connection + Power (single NB toggle) */}
            {/* <div className="device-info-card">
              <div>
                <h3 className="section-title">Device Connection Status and Power:</h3>
                <div className="device-connection-grid">
                  <p>
                    <strong>Connection Status:</strong> {conn ? "Connected" : "Disconnected"}
                  </p> */}

                  {/* NB (System Power) */}
                  {/* <div className="power-item">
                    <span>System Power </span>
                    <div className="power-toggle">
                      <span className={nbWaiting ? "status-waiting" : ""}>
                        {getStatusText(isPowerOn, deviceData.nbGenerator.timestamp, nbWaiting)}
                      </span>
                      <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isPowerOn}
                          onChange={() => !nbWaiting && handlePowerToggle()}
                          disabled={nbWaiting || !conn}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}


            {/* Connection + Power (single NB toggle) */}
  {/* <div className="device-info-card">
    <div>
      <div className="device-info-header">
        <h3 className="section-title">Device Connection Status and Power:</h3>
        <button 
          className={`refresh-status-btn ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefreshStatus}
          disabled={!conn || isRefreshing}
          title="Check latest device status"
        >
          <span className="refresh-text">Check Latest Status</span>
          <FontAwesomeIcon icon={faRotate} className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
        </button>
      </div>
      <div className="device-connection-grid">
        <p>
          <strong>Connection Status:</strong> {conn ? "Connected" : "Disconnected"}
        </p>

                    {/* NB (System Power) */}
                    {/* <div className="power-item">
                      <span>System Power </span>
                      <div className="power-toggle">
                        <span className={nbWaiting ? "status-waiting" : ""}>
                          {getStatusText(isPowerOn, deviceData.nbGenerator.timestamp, nbWaiting)}
                        </span>
                        <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
                          <input
                            type="checkbox"
                            checked={isPowerOn}
                            onChange={() => !nbWaiting && handlePowerToggle()}
                            disabled={nbWaiting || !conn}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */} 


              {/* Connection + Power with Status History */}
<div className="device-info-card">
  <div>
    <div className="device-info-header">
      <h3 className="section-title">Device Connection Status and Power:</h3>
      <button 
        className={`refresh-status-btn ${isRefreshing ? 'refreshing' : ''}`}
        onClick={handleRefreshStatus}
        disabled={!conn || isRefreshing}
        title="Check latest device status"
      >
        <span className="refresh-text">Check Latest Status</span>
        <FontAwesomeIcon icon={faRotate} className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
      </button>
    </div>

    <div className="power-status-layout">
      {/* Left Section: Connection Status and Toggle */}
      <div className="power-status-left">
        <div className="device-connection-grid">
          <p>
            <strong>Connection Status:</strong> {conn ? "Connected" : "Disconnected"}
          </p>

          {/* NB (System Power) */}
          <div className="power-item">
            <span>System Power </span>
            <div className="power-toggle">
              <span className={nbWaiting ? "status-waiting" : ""}>
                {getStatusText(isPowerOn, deviceData.nbGenerator.timestamp, nbWaiting)}
              </span>
              <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
                <input
                  type="checkbox"
                  checked={isPowerOn}
                  onChange={() => !nbWaiting && handlePowerToggle()}
                  disabled={nbWaiting || !conn}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Status History Table */}
      
      <div className="power-status-right">
        <h4 className="status-history-title">Power Status History:</h4>
        {loadingHistory ? (
          <div className="status-history-loading">Loading history...</div>
        ) : powerStatusHistory.length === 0 ? (
          <div className="status-history-empty">No status history available</div>
        ) : (
          <div className="status-history-table-container">
            <table className="status-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {powerStatusHistory.map((record, index) => (
                  <tr key={record.id} className={index === 0 ? 'current-status' : ''}>
                    <td>
                      {new Date(record.timestamp).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.duration_formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

            {/* Device Configuration & Alerts - UPDATED: Always show values, never N/A */}
            <div className="device-info-card device-power-status">
              <div>
                <h3 className="section-title">Device Configuration & Alerts:</h3>

                <div className="device-config-container">
                  <div className="config-row">
                    <div className="config-item">
                      <label>Pump Motor frequency:</label>
                      <span className="config-value">
                        {deviceData.nbGenerator.pump_motor_frequency || 0} Hz
                      </span>
                    </div>
                    <div className="config-item">
                      <label>Total Running Hours:</label>
                      <span className="config-value">
                        {deviceData.nbGenerator.total_running_hours || 0} H
                      </span>
                    </div>
                  </div>

                  <div className="config-row">
                    <div className="config-item">
                      <label>Pump Motor Current:</label>
                      <span className="config-value">
                        {Number(deviceData.nbGenerator.pump_motor_current || 0).toFixed(2)} A
                      </span>
                    </div>
                    <div className="config-item">
                      <label>Total Water Outlet Qty:</label>
                      <span className="config-value">0</span>
                    </div>
                  </div>

                  <div className="config-row">
                    {/* <div className="config-item">
                    <label>Auto Mode:</label>
                      <div className="toggle-container">
                        <label className="toggle-switch auto-toggle">
                          <input
                            type="checkbox"
                            checked={isPowerOn && conn && autoMode}
                            onChange={() => isPowerOn && conn && setAutoMode(!autoMode)}
                            disabled={true}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div> */}
                    <div className="config-item">
                      <label>Auto Mode:</label>
                      <div className="auto-mode-toggle-container">
                        <label className={`auto-mode-switch ${autoWaiting ? "auto-mode-waiting" : ""}`}>
                          <input
                            type="checkbox"
                            checked={autoMode}
                            onChange={() => !autoWaiting && handleAutoModeToggle()}
                            disabled={autoWaiting || !conn || !isPowerOn}
                          />
                          <span className="auto-mode-slider"></span>
                        </label>
                      </div>
                    </div>
                    <div className="config-item">
                    <label>Auto Sequence Counter:</label>
                    <div className="editable-field">
                      <input
                        type="number"
                        value={deviceData.nbGenerator.auto_sequence_counter ?? 0}
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                      />
                      <input
                        type="number"
                        value={counter}
                        onChange={(e) => setCounter(e.target.value)}
                        placeholder={lastWritten.counter || "Enter value"}
                        className="config-input editing"
                        disabled={isWriting.counter}
                        min="0"
                        max="65535"
                      />
                      <button 
                        className={`editt-btn ${writeSuccess.counter ? 'success-btn' : ''}`}
                        onClick={handleCounterClick}
                        disabled={!isPowerOn || !conn || isWriting.counter || !counter}
                        title={counter ? "Click to write value" : "Enter a value first"}
                      >
                        {isWriting.counter ? (
                          <span className="spinner">⟳</span>
                        ) : (
                          <FontAwesomeIcon icon={writeSuccess.counter ? faCheck : faCircleCheck} />
                        )}
                      </button>
                    </div>
                  </div>
                  </div>

                  <div className="config-row">
                    <div className="config-item">
                    <label>Auto Sequence ON Time:</label>
                    <div className="editable-field">
                      <input
                        type="number"
                        value={deviceData.nbGenerator.auto_sequence_on_time ?? 0}
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                      />
                      <input
                        type="number"
                        value={onTime}
                        onChange={(e) => setOnTime(e.target.value)}
                        placeholder={lastWritten.onTime || "Enter value"}
                        className="config-input editing"
                        disabled={isWriting.onTime}
                        min="0"
                        max="65535"
                      />
                      <button 
                        className={`editt-btn ${writeSuccess.onTime ? 'success-btn' : ''}`}
                        onClick={handleOnTimeClick}
                        disabled={!isPowerOn || !conn || isWriting.onTime || !onTime}
                        title={onTime ? "Click to write value" : "Enter a value first"}
                      >
                        {isWriting.onTime ? (
                          <span className="spinner">⟳</span>
                        ) : (
                          <FontAwesomeIcon icon={writeSuccess.onTime ? faCheck : faCircleCheck} />
                        )}
                      </button>
                    </div>
                  </div>
                    <div className="config-item">
                    <label>Auto Sequence OFF Time:</label>
                    <div className="editable-field">
                      <input
                        type="number"
                        value={deviceData.nbGenerator.auto_sequence_off_time ?? 0}
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                      />
                      <input
                        type="number"
                        value={offTime}
                        onChange={(e) => setOffTime(e.target.value)}
                        placeholder={lastWritten.offTime || "Enter value"}
                        className="config-input editing"
                        disabled={isWriting.offTime}
                        min="0"
                        max="65535"
                      />
                      <button 
                        className={`editt-btn ${writeSuccess.offTime ? 'success-btn' : ''}`}
                        onClick={handleOffTimeClick}
                        disabled={!isPowerOn || !conn || isWriting.offTime || !offTime}
                        title={offTime ? "Click to write value" : "Enter a value first"}
                      >
                        {isWriting.offTime ? (
                          <span className="spinner">⟳</span>
                        ) : (
                          <FontAwesomeIcon icon={writeSuccess.offTime ? faCheck : faCircleCheck} />
                        )}
                      </button>
                    </div>
                  </div>

                    
                  </div>
                </div>
              </div>
            </div>
            {isPowerOn && <DeviceCharts deviceId={id} />}
            {!isPowerOn && (
              <div className="device-info-card">
                <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                  <h3>System Power is OFF</h3>
                  <p>Turn on the system power to view sensor data and charts.</p>
                </div>
              </div>
            )}

            <div className="device-info-card">
              <div>
                <h3 className="section-title">Device Alert and Info History:</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>No Alerts to show!</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  export default DeviceDetails;