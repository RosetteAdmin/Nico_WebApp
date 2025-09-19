// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./DeviceDetails.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import DeviceCharts from "../DataChart";
// import { faLink, faPencil, faEllipsisH, faCheck } from "@fortawesome/free-solid-svg-icons";
// import { faCircleCheck, faPenToSquare } from '@fortawesome/free-regular-svg-icons';

// import svg1 from "./../../Images/Dashboard/Icon.svg";

// const DeviceDetails = () => {
//   const { id } = useParams();
  
//   // State for the device's display name, fetched from the API
//   const [deviceName, setDeviceName] = useState('Loading...');
  
//   // Updated state structure for sensor data
//   const [deviceData, setDeviceData] = useState({
//     nbGenerator: {
//       flowRate: '',
//       pressure: '',
//       waterTemperature: '',
//       systemTemperature: '',
//       totalWaterOutlet: '',
//       pump_motor_frequency: null,
//       pump_motor_current: null,
//       total_running_hours: null,
//       auto_sequence_on_time: null,
//       auto_sequence_off_time: null,
//       auto_sequence_counter: null,
//       alert_status: 0,
//       timestamp: ''
//     },
//     ozoneGenerator: {
//       flowRate: '',
//       pressure: '',
//       waterTemperature: '',
//       systemTemperature: '',
//       totalWaterOutlet: '',
//       timestamp: ''
//     },
//     oxygenGenerator: {
//       flowRate: '',
//       pressure: '',
//       waterTemperature: '',
//       systemTemperature: '',
//       totalWaterOutlet: '',
//       timestamp: ''
//     }
//   });

//   const [nbGeneratorPower, setNbGeneratorPower] = useState(false);
//   const [ozoneGeneratorPower, setOzoneGeneratorPower] = useState(false);
//   const [oxygenGeneratorPower, setOxygenGeneratorPower] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [conn, setConn] = useState(false);
  
//   // States to track which switches are currently waiting for update
//   const [nbWaiting, setNbWaiting] = useState(false);
//   const [ozoneWaiting, setOzoneWaiting] = useState(false);
//   const [oxygenWaiting, setOxygenWaiting] = useState(false);
  
//   // Timestamps for when toggle requests were made
//   const [nbRequestTime, setNbRequestTime] = useState(0);
//   const [ozoneRequestTime, setOzoneRequestTime] = useState(0);
//   const [oxygenRequestTime, setOxygenRequestTime] = useState(0);

//   // State for configuration panel
//   const [autoMode, setAutoMode] = useState(false);
//   const [onTime, setOnTime] = useState('100');
//   const [offTime, setOffTime] = useState('120');
//   const [counter, setCounter] = useState('360');
  
//   const [isEditingOnTime, setIsEditingOnTime] = useState(false);
//   const [isEditingOffTime, setIsEditingOffTime] = useState(false);
//   const [isEditingCounter, setIsEditingCounter] = useState(false);

//   // State for power control - Controls data fetching and display
//   const [isPowerOn, setIsPowerOn] = useState(true);

//   // Fetch the device display name from the devices list on component mount
//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_EP}/api/devices`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch device list');
//         }
//         return response.json();
//       })
//       .then(data => {
//         // The API response has a 'value' property which is an array of devices
//         const deviceList = data.value;
//         // Find the device in the list that matches the id from the URL params
//         const currentDevice = deviceList.find(device => device.id === id);
        
//         if (currentDevice) {
//           // If the device is found, update the state with its displayName
//           setDeviceName(currentDevice.displayName);
//         } else {
//           // If not found, set a fallback name
//           setDeviceName('Device Not Found');
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching device name:', error);
//         setDeviceName('Error Loading Name');
//       });
//   }, [id]); // This effect depends on the `id` from the URL

//   // Check connection status once on mount
//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (data.status === 'Connected') {
//           setConn(true);
//         } else {
//           setConn(false);
//         }
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching device status:', error);
//         setLoading(false);
//         setConn(false);
//       });
//   }, [id]);

//   // Fetch device data at regular intervals if connected AND power is ON
//   useEffect(() => {
//     if (!conn || !isPowerOn) return;
    
//     const fetchData = () => {
//       fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`)
//         .then(response => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log('Fetched transformed sensor data:', data);
          
//           setDeviceData({
//             nbGenerator: {
//               flowRate: data.nbGenerator.flowRate,
//               pressure: data.nbGenerator.pressure,
//               waterTemperature: data.nbGenerator.waterTemperature,
//               systemTemperature: data.nbGenerator.systemTemperature,
//               totalWaterOutlet: data.nbGenerator.totalWaterOutlet,
//               pump_motor_frequency: data.nbGenerator.pump_motor_frequency,
//               pump_motor_current: data.nbGenerator.pump_motor_current,
//               total_running_hours: data.nbGenerator.total_running_hours,
//               auto_sequence_on_time: data.nbGenerator.auto_sequence_on_time,
//               auto_sequence_off_time: data.nbGenerator.auto_sequence_off_time,
//               auto_sequence_counter: data.nbGenerator.auto_sequence_counter,
//               alert_status: data.nbGenerator.alert_status,
//               timestamp: data.nbGenerator.timestamp
//             },
//             ozoneGenerator: {
//               flowRate: data.ozoneGenerator.flowRate,
//               pressure: data.ozoneGenerator.pressure,
//               waterTemperature: data.ozoneGenerator.waterTemperature,
//               systemTemperature: data.ozoneGenerator.systemTemperature,
//               totalWaterOutlet: data.ozoneGenerator.totalWaterOutlet,
//               timestamp: data.ozoneGenerator.timestamp
//             },
//             oxygenGenerator: {
//               flowRate: data.oxygenGenerator.flowRate,
//               pressure: data.oxygenGenerator.pressure,
//               waterTemperature: data.oxygenGenerator.waterTemperature,
//               systemTemperature: data.oxygenGenerator.systemTemperature,
//               totalWaterOutlet: data.oxygenGenerator.totalWaterOutlet,
//               timestamp: data.oxygenGenerator.timestamp
//             }
//           });

//           setOnTime(data.nbGenerator.auto_sequence_on_time || '100');
//           setOffTime(data.nbGenerator.auto_sequence_off_time || '120');
//           setCounter(data.nbGenerator.auto_sequence_counter || '360');
//           setAutoMode(data.nbGenerator.alert_status > 0);
          
//           const currentTime = Date.now();
//           const timeoutThreshold = 15000;
          
//           if (nbWaiting && (data.nbGenerator.nbStatus !== nbGeneratorPower || currentTime - nbRequestTime > timeoutThreshold)) {
//             setNbWaiting(false);
//           }
//           if (ozoneWaiting && (data.ozoneGenerator.O3Status !== ozoneGeneratorPower || currentTime - ozoneRequestTime > timeoutThreshold)) {
//             setOzoneWaiting(false);
//           }
//           if (oxygenWaiting && (data.oxygenGenerator.O2Status !== oxygenGeneratorPower || currentTime - oxygenRequestTime > timeoutThreshold)) {
//             setOxygenWaiting(false);
//           }

//           setNbGeneratorPower(data.nbGenerator.nbStatus);
//           setOzoneGeneratorPower(data.ozoneGenerator.O3Status);
//           setOxygenGeneratorPower(data.oxygenGenerator.O2Status);
//         })
//         .catch(error => {
//           console.error('Error fetching device data:', error);
//           setNbWaiting(false);
//           setOzoneWaiting(false);
//           setOxygenWaiting(false);
//         });
//     };

//     fetchData();
//     const intervalId = setInterval(fetchData, 5000);
    
//     return () => clearInterval(intervalId);
//   }, [id, conn, isPowerOn, nbGeneratorPower, ozoneGeneratorPower, oxygenGeneratorPower, nbWaiting, ozoneWaiting, oxygenWaiting, nbRequestTime, ozoneRequestTime, oxygenRequestTime]);

//   const handlePowerToggle = (type) => {
//     const currentTime = Date.now();

//     if (type === "nb") {
//       setNbWaiting(true);
//       setNbRequestTime(currentTime);

//       if (!conn) {
//         setNbWaiting(false);
//         return;
//       }

//       setIsPowerOn(prev => !prev);
//       setNbGeneratorPower(prev => !prev);
      
//       setTimeout(() => {
//         setNbWaiting(false);
//       }, 2000);
//       return;
//     }

//     if (type === "o3") {
//       setOzoneWaiting(true);
//       setOzoneRequestTime(currentTime);
//       setOzoneGeneratorPower(prev => !prev);
//     } else if (type === "o2") {
//       setOxygenWaiting(true);
//       setOxygenRequestTime(currentTime);
//       setOxygenGeneratorPower(prev => !prev);
//     }

//     fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/${type}`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' }
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (type === "o3" && data.O3Status !== undefined) {
//           setOzoneGeneratorPower(data.O3Status);
//           setOzoneWaiting(false);
//         } else if (type === "o2" && data.O2Status !== undefined) {
//           setOxygenGeneratorPower(data.O2Status);
//           setOxygenWaiting(false);
//         }
//       })
//       .catch(error => {
//         console.error('Error updating power status:', error);
//         if (type === "o3") {
//           setOzoneGeneratorPower(prev => !prev);
//           setOzoneWaiting(false);
//         } else if (type === "o2") {
//           setOxygenGeneratorPower(prev => !prev);
//           setOxygenWaiting(false);
//         }
//       });
//   };
  
//   const getStatusText = (isPowered, timestamp, isWaiting) => {
//     if (!conn) return "Disconnected";
//     if (isWaiting) return "request sent ";
//     if (isPowered && isPowerOn) {
//       const date = new Date(timestamp);
//       const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
//       const timeStr = date.toLocaleTimeString();
//       const now = new Date();
//       const diffInMs = now - date;
//       const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
//       const diffInDays = Math.floor(diffInHours / 24);
//       let timeAgo;
//       if (diffInDays > 0) timeAgo = `(${diffInDays} day${diffInDays > 1 ? 's' : ''} ago)`;
//       else if (diffInHours > 0) timeAgo = `(${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago)`;
//       else {
//         const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
//         timeAgo = `(${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago)`;
//       }
//       return (
//         <span className="status-datetime">
//           On from: {timeStr}<br />
//           {dateStr}
//           <span className="time-ago">{timeAgo}</span>
//         </span>
//       );
//     } else if (!isPowerOn) {
//       return "System OFF";
//     }
//     return "OFF"; // Default case for powered off but system on
//   };

//   return (
//     <>
//       <div className="device-details-banner">
//         <div className="device-details-header">
//           <h2 className="device-details-title">
//             <strong>Device Name || </strong><span className="device-name">{deviceName}</span>
//           </h2>
//           <div className="device-details-status">
//             <span className="device-connection-status">
//               <FontAwesomeIcon icon={faLink} className={`status-icon ${conn ? 'green' : 'red'}`} />
//               {conn ? 'Connected' : 'Disconnected'}
//             </span>
//             <span className={`connection-badge ${isPowerOn ? 'on' : 'off'}`}>{isPowerOn ? 'ON' : 'OFF'}</span>
//             <span className={`connection-label ${isPowerOn ? 'green' : 'red'}`}>{isPowerOn ? 'Power ON' : 'Power OFF'}</span>
//           </div>
//         </div>
//         {conn && (
//           <div className="device-power-status-banner">
//             <span className={`power-badge ${isPowerOn ? 'on' : 'off'}`}>{isPowerOn ? 'ON' : 'OFF'}</span>
//             <span className={`power-label ${isPowerOn ? 'green' : 'red'}`}>{isPowerOn ? 'Power ON' : 'Power OFF'}</span>
//           </div>
//         )}
//       </div>

//       {loading && (
//         <div className="loading-backdrop">
//           <div className="loading-spinner"></div>
//           <div className="loading-text">Waiting for device...</div>
//         </div>
//       )}

//       {!loading && (
//         <div className="device-detail-container">
//           <div className="device-info-card">
//             <div className="device-info-header">
//               <h3 className="section-title">Device Basic Information:</h3>
//               <button className="editt-btn"><FontAwesomeIcon icon={faPencil} />Edit</button>
//             </div>
//             <div className="device-info-grid">
//               <p><strong>Device Name:</strong> {deviceName}</p>
//               <p><strong>Owner Name:</strong> Random_Name</p>
//               <p><strong>Owner Phone:</strong> 90354651234</p>
//               <p><strong>Device ID:</strong> {id}</p>
//               <p><strong>Owner Email ID:</strong> Email ID</p>
//               <p><strong>Device Sector:</strong> Karnataka</p>
//             </div>
//           </div>

//           <div className="device-info-card">
//             <div>
//               <h3 className="section-title">Device Connection Status and Subscriptions:</h3>
//               <div className="device-connection-grid">
//                 <p><strong>Connection Status:</strong> {conn ? 'Connected via Wi-Fi' : 'Disconnected'}</p>
//                 <div className="power-item">
//                   <span>System Power</span>
//                   <div className="power-toggle">
//                     <span className={nbWaiting ? "status-waiting" : ""}>{getStatusText(nbGeneratorPower, deviceData.nbGenerator.timestamp, nbWaiting)}</span>
//                     <span className={`power-status-text ${isPowerOn ? 'on' : 'off'}`}></span>
//                     <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
//                       <input type="checkbox" checked={isPowerOn} onChange={() => !nbWaiting && handlePowerToggle("nb")} disabled={nbWaiting || !conn} title={!conn ? "Device is disconnected" : undefined} />
//                       <span className="toggle-slider"></span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="device-info-card device-power-status">
//             <div>
//               <h3 className="section-title">Device Configuration & Alerts:</h3>
//               <div className="device-config-container">
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Pump Motor frequency:</label>
//                     <span className="config-value">{isPowerOn && conn ? (deviceData.nbGenerator.pump_motor_frequency ? `${deviceData.nbGenerator.pump_motor_frequency} Hz` : 'N/A') : 'N/A'}</span>
//                   </div>
//                   <div className="config-item">
//                     <label>Total Running Hours:</label>
//                     <span className="config-value">{isPowerOn && conn ? (deviceData.nbGenerator.total_running_hours ? `${deviceData.nbGenerator.total_running_hours} H` : 'N/A') : 'N/A'}</span>
//                   </div>
//                 </div>
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Pump Motor Current:</label>
//                     <span className="config-value">{isPowerOn && conn ? (deviceData.nbGenerator.pump_motor_current ? `${deviceData.nbGenerator.pump_motor_current.toFixed(2)} A` : 'N/A') : 'N/A'}</span>
//                   </div>
//                   <div className="config-item">
//                     <label>Total Water Outlet Qty:</label>
//                     <span className="config-value">{isPowerOn && conn ? 'N/A' : 'N/A'}</span>
//                   </div>
//                 </div>
//                 {/* Auto Mode and other config items remain here */}
//               </div>
//             </div>
//           </div>

//           {isPowerOn && <DeviceCharts deviceId={id} />}
          
//           {!isPowerOn && (
//             <div className="device-info-card">
//               <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
//                 <h3>System Power is OFF</h3>
//                 <p>Turn on the system power to view sensor data and charts.</p>
//               </div>
//             </div>
//           )}

//           <div className="device-info-card">
//             <div>
//               <h3 className="section-title">Device Alert and Info History:</h3>
//               <table>
//                 <tbody>
//                   <tr>
//                     <td>No Alerts to show!</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default DeviceDetails;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DeviceDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeviceCharts from "../DataChart";
import { faLink, faPencil, faEllipsisH, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck, faPenToSquare } from '@fortawesome/free-regular-svg-icons';

import svg1 from "./../../Images/Dashboard/Icon.svg";

const DeviceDetails = () => {
  const { id } = useParams();
  
  // State for the device's display name
  const [deviceName, setDeviceName] = useState('Loading...');

  // State to hold detailed device info (owner, phone, etc.)
  const [deviceInfo, setDeviceInfo] = useState({
    owner_name: 'Loading...',
    phone_number: 'Loading...',
    email_id: 'Loading...',
    location: 'Loading...',
  });
  
  // State structure for sensor data
  const [deviceData, setDeviceData] = useState({
    nbGenerator: {
      flowRate: '',
      pressure: '',
      waterTemperature: '',
      systemTemperature: '',
      totalWaterOutlet: '',
      pump_motor_frequency: null,
      pump_motor_current: null,
      total_running_hours: null,
      auto_sequence_on_time: null,
      auto_sequence_off_time: null,
      auto_sequence_counter: null,
      alert_status: 0,
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
  
  // States to track which switches are currently waiting for update
  const [nbWaiting, setNbWaiting] = useState(false);
  const [ozoneWaiting, setOzoneWaiting] = useState(false);
  const [oxygenWaiting, setOxygenWaiting] = useState(false);
  
  // Timestamps for when toggle requests were made
  const [nbRequestTime, setNbRequestTime] = useState(0);
  const [ozoneRequestTime, setOzoneRequestTime] = useState(0);
  const [oxygenRequestTime, setOxygenRequestTime] = useState(0);

  // State for configuration panel
  const [autoMode, setAutoMode] = useState(false);
  const [onTime, setOnTime] = useState('100');
  const [offTime, setOffTime] = useState('120');
  const [counter, setCounter] = useState('360');
  
  const [isEditingOnTime, setIsEditingOnTime] = useState(false);
  const [isEditingOffTime, setIsEditingOffTime] = useState(false);
  const [isEditingCounter, setIsEditingCounter] = useState(false);

  // State for power control - Controls data fetching and display
  const [isPowerOn, setIsPowerOn] = useState(true);

  // This useEffect now fetches all basic device info at once
  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch device info');
        }
        return response.json();
      })
      .then(apiResponse => {
        if (apiResponse.status === 'success' && apiResponse.data) {
          const { device_name, owner_name, phone_number, email_id, location } = apiResponse.data;
          
          // Update the device name state
          setDeviceName(device_name || 'N/A');
          
          // Update the detailed info state
          setDeviceInfo({
            owner_name: owner_name || 'N/A',
            phone_number: phone_number || 'N/A',
            email_id: email_id || 'N/A',
            location: location || 'N/A'
          });
        } else {
          throw new Error('Invalid data structure from API');
        }
      })
      .catch(error => {
        console.error('Error fetching device details:', error);
        // Set error states for user feedback
        setDeviceName('Error');
        setDeviceInfo({
          owner_name: 'Error',
          phone_number: 'Error',
          email_id: 'Error',
          location: 'Error'
        });
      });
  }, [id]); // Re-run this effect if the device id changes


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

  // Fetch device sensor data at regular intervals
  useEffect(() => {
    if (!conn || !isPowerOn) return;
    
    const fetchData = () => {
      fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched transformed sensor data:', data);
          
          setDeviceData({
            nbGenerator: {
              flowRate: data.nbGenerator.flowRate,
              pressure: data.nbGenerator.pressure,
              waterTemperature: data.nbGenerator.waterTemperature,
              systemTemperature: data.nbGenerator.systemTemperature,
              totalWaterOutlet: data.nbGenerator.totalWaterOutlet,
              pump_motor_frequency: data.nbGenerator.pump_motor_frequency,
              pump_motor_current: data.nbGenerator.pump_motor_current,
              total_running_hours: data.nbGenerator.total_running_hours,
              auto_sequence_on_time: data.nbGenerator.auto_sequence_on_time,
              auto_sequence_off_time: data.nbGenerator.auto_sequence_off_time,
              auto_sequence_counter: data.nbGenerator.auto_sequence_counter,
              alert_status: data.nbGenerator.alert_status,
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

          setOnTime(data.nbGenerator.auto_sequence_on_time || '100');
          setOffTime(data.nbGenerator.auto_sequence_off_time || '120');
          setCounter(data.nbGenerator.auto_sequence_counter || '360');
          setAutoMode(data.nbGenerator.alert_status > 0);
          
          const currentTime = Date.now();
          const timeoutThreshold = 15000;
          
          if (nbWaiting && (data.nbGenerator.nbStatus !== nbGeneratorPower || currentTime - nbRequestTime > timeoutThreshold)) {
            setNbWaiting(false);
          }
          if (ozoneWaiting && (data.ozoneGenerator.O3Status !== ozoneGeneratorPower || currentTime - ozoneRequestTime > timeoutThreshold)) {
            setOzoneWaiting(false);
          }
          if (oxygenWaiting && (data.oxygenGenerator.O2Status !== oxygenGeneratorPower || currentTime - oxygenRequestTime > timeoutThreshold)) {
            setOxygenWaiting(false);
          }

          setNbGeneratorPower(data.nbGenerator.nbStatus);
          setOzoneGeneratorPower(data.ozoneGenerator.O3Status);
          setOxygenGeneratorPower(data.oxygenGenerator.O2Status);
        })
        .catch(error => {
          console.error('Error fetching device data:', error);
          setNbWaiting(false);
          setOzoneWaiting(false);
          setOxygenWaiting(false);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    
    return () => clearInterval(intervalId);
  }, [id, conn, isPowerOn, nbGeneratorPower, ozoneGeneratorPower, oxygenGeneratorPower, nbWaiting, ozoneWaiting, oxygenWaiting, nbRequestTime, ozoneRequestTime, oxygenRequestTime]);

  const handlePowerToggle = (type) => {
    const currentTime = Date.now();

    if (type === "nb") {
      setNbWaiting(true);
      setNbRequestTime(currentTime);

      if (!conn) {
        setNbWaiting(false);
        return;
      }

      setIsPowerOn(prev => !prev);
      setNbGeneratorPower(prev => !prev);
      
      setTimeout(() => {
        setNbWaiting(false);
      }, 2000);
      return;
    }

    if (type === "o3") {
      setOzoneWaiting(true);
      setOzoneRequestTime(currentTime);
      setOzoneGeneratorPower(prev => !prev);
    } else if (type === "o2") {
      setOxygenWaiting(true);
      setOxygenRequestTime(currentTime);
      setOxygenGeneratorPower(prev => !prev);
    }

    fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/${type}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (type === "o3" && data.O3Status !== undefined) {
          setOzoneGeneratorPower(data.O3Status);
          setOzoneWaiting(false);
        } else if (type === "o2" && data.O2Status !== undefined) {
          setOxygenGeneratorPower(data.O2Status);
          setOxygenWaiting(false);
        }
      })
      .catch(error => {
        console.error('Error updating power status:', error);
        if (type === "o3") {
          setOzoneGeneratorPower(prev => !prev);
          setOzoneWaiting(false);
        } else if (type === "o2") {
          setOxygenGeneratorPower(prev => !prev);
          setOxygenWaiting(false);
        }
      });
  };
  
  const getStatusText = (isPowered, timestamp, isWaiting) => {
    if (!conn) return "Disconnected";
    if (isWaiting) return "request sent ";
    if (isPowered && isPowerOn) {
      const date = new Date(timestamp);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeStr = date.toLocaleTimeString();
      const now = new Date();
      const diffInMs = now - date;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      let timeAgo;
      if (diffInDays > 0) timeAgo = `(${diffInDays} day${diffInDays > 1 ? 's' : ''} ago)`;
      else if (diffInHours > 0) timeAgo = `(${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago)`;
      else {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        timeAgo = `(${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago)`;
      }
      return (
        <span className="status-datetime">
          On from: {timeStr}<br />
          {dateStr}
          <span className="time-ago">{timeAgo}</span>
        </span>
      );
    } else if (!isPowerOn) {
      return "System OFF";
    }
    return "OFF"; // Default case for powered off but system on
  };

  return (
    <>
      <div className="device-details-banner">
        <div className="device-details-header">
          <h2 className="device-details-title">
            <strong>Device Name || </strong><span className="device-name">{deviceName}</span>
          </h2>
          <div className="device-details-status">
            <span className="device-connection-status">
              <FontAwesomeIcon icon={faLink} className={`status-icon ${conn ? 'green' : 'red'}`} />
              {conn ? 'Connected' : 'Disconnected'}
            </span>
            <span className={`connection-badge ${isPowerOn ? 'on' : 'off'}`}>{isPowerOn ? 'ON' : 'OFF'}</span>
            <span className={`connection-label ${isPowerOn ? 'green' : 'red'}`}>{isPowerOn ? 'Power ON' : 'Power OFF'}</span>
          </div>
        </div>
        {conn && (
          <div className="device-power-status-banner">
            <span className={`power-badge ${isPowerOn ? 'on' : 'off'}`}>{isPowerOn ? 'ON' : 'OFF'}</span>
            <span className={`power-label ${isPowerOn ? 'green' : 'red'}`}>{isPowerOn ? 'Power ON' : 'Power OFF'}</span>
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
          <div className="device-info-card">
            <div className="device-info-header">
              <h3 className="section-title">Device Basic Information:</h3>
              <button className="editt-btn"><FontAwesomeIcon icon={faPencil} />Edit</button>
            </div>
            <div className="device-info-grid">
              <p><strong>Device Name:</strong> {deviceName}</p>
              <p><strong>Owner Name:</strong> {deviceInfo.owner_name}</p>
              <p><strong>Owner Phone:</strong> {deviceInfo.phone_number}</p>
              <p><strong>Device ID:</strong> {id}</p>
              <p><strong>Owner Email ID:</strong> {deviceInfo.email_id}</p>
              <p><strong>Device Sector:</strong> {deviceInfo.location}</p>
            </div>
          </div>

          <div className="device-info-card">
            <div>
              <h3 className="section-title">Device Connection Status and Subscriptions:</h3>
              <div className="device-connection-grid">
                <p><strong>Connection Status:</strong> {conn ? 'Connected via Wi-Fi' : 'Disconnected'}</p>
                <div className="power-item">
                  <span>System Power</span>
                  <div className="power-toggle">
                    <span className={nbWaiting ? "status-waiting" : ""}>{getStatusText(nbGeneratorPower, deviceData.nbGenerator.timestamp, nbWaiting)}</span>
                    <span className={`power-status-text ${isPowerOn ? 'on' : 'off'}`}></span>
                    <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
                      <input type="checkbox" checked={isPowerOn} onChange={() => !nbWaiting && handlePowerToggle("nb")} disabled={nbWaiting || !conn} title={!conn ? "Device is disconnected" : undefined} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Device Configuration & Alerts Section - Show N/A or disable when disconnected or power is OFF */}
                <div className="device-info-card device-power-status">
                  <div>
                    <h3 className="section-title">
                      Device Configuration & Alerts:
                    </h3>
                    
                    <div className="device-config-container">
                      <div className="config-row">
                        <div className="config-item">
                          <label>Pump Motor frequency:</label>
                          <span className="config-value">
                            {isPowerOn && conn
                              ? (deviceData.nbGenerator.pump_motor_frequency ? `${deviceData.nbGenerator.pump_motor_frequency} Hz` : 'N/A')
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="config-item">
                          <label>Total Running Hours:</label>
                          <span className="config-value">
                            {isPowerOn && conn
                              ? (deviceData.nbGenerator.total_running_hours ? `${deviceData.nbGenerator.total_running_hours} H` : 'N/A')
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
      
                      <div className="config-row">
                        <div className="config-item">
                          <label>Pump Motor Current:</label>
                          <span className="config-value">
                            {isPowerOn && conn
                              ? (deviceData.nbGenerator.pump_motor_current ? `${deviceData.nbGenerator.pump_motor_current.toFixed(2)} A` : 'N/A')
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="config-item">
                          <label>Total Water Outlet Qty:</label>
                          <span className="config-value">
                            {isPowerOn && conn ? 'N/A' : 'N/A'}
                          </span>
                        </div>
                      </div>
      
                      <div className="config-row">
                        <div className="config-item">
                          <label>Auto Mode:</label>
                          <div className="toggle-container">
                            <label className="toggle-switch auto-toggle">
                              <input
                                type="checkbox"
                                checked={isPowerOn && conn && autoMode}
                                onChange={() => isPowerOn && conn && setAutoMode(!autoMode)}
                                disabled={!isPowerOn || !conn}
                                title={!conn ? "Device is disconnected" : undefined}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </div>
                        </div>
                        <div className="config-item">
                          <label>Auto Sequence Counter:</label>
                          <div className="editable-field">
                            <input
                              type="number"
                              value={isPowerOn && conn ? counter : 'N/A'}
                              onChange={(e) => setCounter(e.target.value)}
                              disabled={!isPowerOn || !conn}
                              className={`config-input ${isEditingCounter ? 'editingg' : ''}`}
                            />
                            <button 
                              onClick={() => isPowerOn && conn && setIsEditingCounter(!isEditingCounter)} 
                              className="editt-btn"
                              disabled={!isPowerOn || !conn}
                              title={!conn ? "Device is disconnected" : undefined}
                            >
                              <FontAwesomeIcon icon={faPenToSquare } />
                            </button>
                            <input
                              type="number"
                              onChange={(e) => setCounter(e.target.value)}
                              disabled={!isEditingCounter || !isPowerOn || !conn}
                              className={`config-input ${isEditingCounter ? 'editing' : ''}`}
                            />
                            <button 
                              className="editt-btn"
                              disabled={!isPowerOn || !conn}
                            >
                              <FontAwesomeIcon icon={faCircleCheck} />
                            </button>
                            <span className="checkmark-icon">
                              <FontAwesomeIcon icon={faCheck} />
                            </span>
                          </div>
                        </div>
                      </div>
      
                      <div className="config-row">
                        <div className="config-item">
                          <label>Auto Sequence ON Time:</label>
                          <div className="editable-field">
                            <input
                              type="number"
                              value={isPowerOn && conn ? onTime : 'N/A'}
                              onChange={(e) => setOnTime(e.target.value)}
                              disabled={!isPowerOn || !conn}
                              className={`config-input ${isEditingOnTime ? 'editingg' : ''}`}
                            />
                            <button 
                              onClick={() => isPowerOn && conn && setIsEditingOnTime(!isEditingOnTime)} 
                              className="editt-btn"
                              disabled={!isPowerOn || !conn}
                              title={!conn ? "Device is disconnected" : undefined}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <input
                              type="number"
                              onChange={(e) => setOnTime(e.target.value)}
                              disabled={!isEditingOnTime || !isPowerOn || !conn}
                              className={`config-input ${isEditingOnTime ? 'editing' : ''}`}
                            />
                            <button 
                              className="editt-btn"
                              disabled={!isPowerOn || !conn}
                            >
                              <FontAwesomeIcon icon={faCircleCheck} />
                            </button>
                          </div>
                        </div>
                        <div className="config-item">
                          <label>Auto Sequence OFF Time:</label>
                          <div className="editable-field">
                            <input
                              type="number"
                              value={isPowerOn && conn ? offTime : 'N/A'}
                              onChange={(e) => setOffTime(e.target.value)}
                              disabled={!isPowerOn || !conn}
                              className={`config-input ${isEditingOffTime ? 'editingg' : ''}`}
                            />
                            <button 
                              onClick={() => isPowerOn && conn && setIsEditingOffTime(!isEditingOffTime)} 
                              className="editt-btn"
                              disabled={!isPowerOn || !conn}
                              title={!conn ? "Device is disconnected" : undefined}
                            >
                              <FontAwesomeIcon icon={faPenToSquare } />
                            </button>
                            <input
                              type="number"
                              onChange={(e) => setOffTime(e.target.value)}
                              disabled={!isEditingOffTime || !isPowerOn || !conn}
                              className={`config-input ${isEditingOffTime ? 'editing' : ''}`}
                            />
                            <button 
                              className="editt-btn"
                              disabled={!isPowerOn || !conn}
                            >
                              <FontAwesomeIcon icon={faCircleCheck} />
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
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
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
