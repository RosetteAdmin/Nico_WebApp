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
  
//   // Add states to track which switches are currently waiting for update
//   const [nbWaiting, setNbWaiting] = useState(false);
//   const [ozoneWaiting, setOzoneWaiting] = useState(false);
//   const [oxygenWaiting, setOxygenWaiting] = useState(false);
  
//   // Add timestamps for when toggle requests were made
//   const [nbRequestTime, setNbRequestTime] = useState(0);
//   const [ozoneRequestTime, setOzoneRequestTime] = useState(0);
//   const [oxygenRequestTime, setOxygenRequestTime] = useState(0);

//   // NEW STATE FOR CONFIGURATION PANEL
//   const [autoMode, setAutoMode] = useState(false);
//   const [onTime, setOnTime] = useState('100');
//   const [offTime, setOffTime] = useState('120');
//   const [counter, setCounter] = useState('360');
  
//   const [isEditingOnTime, setIsEditingOnTime] = useState(false);
//   const [isEditingOffTime, setIsEditingOffTime] = useState(false);
//   const [isEditingCounter, setIsEditingCounter] = useState(false);

//   // NEW STATE FOR POWER CONTROL - Controls data fetching and display
//   const [isPowerOn, setIsPowerOn] = useState(true);

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
//     // Only fetch data if connection is established AND power is ON
//     if (!conn || !isPowerOn) return;
    
//     const fetchData = () => {
//       // Using the existing endpoint that now returns transformed sensor data
//       fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`)
//         .then(response => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log('Fetched transformed sensor data:', data);
          
//           // Your backend now returns the transformed data structure
//           setDeviceData({
//             nbGenerator: {
//               flowRate: data.nbGenerator.flowRate,
//               pressure: data.nbGenerator.pressure,
//               waterTemperature: data.nbGenerator.waterTemperature,
//               systemTemperature: data.nbGenerator.systemTemperature,
//               totalWaterOutlet: data.nbGenerator.totalWaterOutlet,
//               // NEW SENSOR FIELDS from the transformed data
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

//           // Update configuration panel values from backend data
//           setOnTime(data.nbGenerator.auto_sequence_on_time || '100');
//           setOffTime(data.nbGenerator.auto_sequence_off_time || '120');
//           setCounter(data.nbGenerator.auto_sequence_counter || '360');
//           setAutoMode(data.nbGenerator.alert_status > 0);
          
//           // Get the current timestamp for comparison
//           const currentTime = Date.now();
//           const timeoutThreshold = 15000; // 15 seconds timeout
          
//           // Clear waiting states based on timestamps or when status changes
//           // NB Generator
//           if (nbWaiting && (
//               data.nbGenerator.nbStatus !== nbGeneratorPower || 
//               currentTime - nbRequestTime > timeoutThreshold
//           )) {
//             setNbWaiting(false);
//           }
          
//           // Ozone Generator
//           if (ozoneWaiting && (
//               data.ozoneGenerator.O3Status !== ozoneGeneratorPower || 
//               currentTime - ozoneRequestTime > timeoutThreshold
//           )) {
//             setOzoneWaiting(false);
//           }
          
//           // Oxygen Generator
//           if (oxygenWaiting && (
//               data.oxygenGenerator.O2Status !== oxygenGeneratorPower || 
//               currentTime - oxygenRequestTime > timeoutThreshold
//           )) {
//             setOxygenWaiting(false);
//           }

//           // Update power states
//           setNbGeneratorPower(data.nbGenerator.nbStatus);
//           setOzoneGeneratorPower(data.ozoneGenerator.O3Status);
//           setOxygenGeneratorPower(data.oxygenGenerator.O2Status);
          
//         })
//         .catch(error => {
//           console.error('Error fetching device data:', error);
//           // Clear waiting states in case of error to prevent UI from being stuck
//           setNbWaiting(false);
//           setOzoneWaiting(false);
//           setOxygenWaiting(false);
//         });
//     };

//     fetchData(); // Fetch data immediately when connected
//     const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    
//     return () => clearInterval(intervalId); // Cleanup interval on unmount
//   }, [id, conn, isPowerOn, nbGeneratorPower, ozoneGeneratorPower, oxygenGeneratorPower, nbWaiting, ozoneWaiting, oxygenWaiting, nbRequestTime, ozoneRequestTime, oxygenRequestTime]);

//   // UPDATED handlePowerToggle function to control data fetching
//   const handlePowerToggle = (type) => {
//     const currentTime = Date.now();

//     // Handle main power toggle - controls data fetching
//     if (type === "nb") {
//       setNbWaiting(true);
//       setNbRequestTime(currentTime);

//       // If disconnected, do not allow toggling main power
//       if (!conn) {
//         setNbWaiting(false);
//         return;
//       }

//       setIsPowerOn(prev => !prev); // Toggle power state
//       setNbGeneratorPower(prev => !prev); // Immediate UI update
      
//       // Simulate API call completion after a delay
//       setTimeout(() => {
//         setNbWaiting(false);
//       }, 2000);
//       return;
//     }

//     // Handle other generator toggles (existing logic)
//     if (type === "o3") {
//       setOzoneWaiting(true);
//       setOzoneRequestTime(currentTime);
//       setOzoneGeneratorPower(prev => !prev);
//     } else if (type === "o2") {
//       setOxygenWaiting(true);
//       setOxygenRequestTime(currentTime);
//       setOxygenGeneratorPower(prev => !prev);
//     }

//     // Make an API call to update the power status
//     fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/${type}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         // Update state based on API response if it includes status
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
        
//         // Revert to previous state on error
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
//     if (!conn) {
//       return "Disconnected";
//     }
//     if (isWaiting) {
//       return "request sent ";
//     } else if (isPowered && isPowerOn) {
//       const date = new Date(timestamp);
//       const dateStr = date.toLocaleDateString('en-GB', { 
//         day: 'numeric', 
//         month: 'short', 
//         year: 'numeric' 
//       });
//       const timeStr = date.toLocaleTimeString(); // Just the time
      
//       // Calculate hours ago
//       const now = new Date();
//       const diffInMs = now - date;
//       const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
//       const diffInDays = Math.floor(diffInHours / 24);
      
//       let timeAgo;
//       if (diffInDays > 0) {
//         timeAgo = `(${diffInDays} day${diffInDays > 1 ? 's' : ''} ago)`;
//       } else if (diffInHours > 0) {
//         timeAgo = `(${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago)`;
//       } else {
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
//   };

//   return (
//     <>
//       <div className="device-details-banner">
//         <div className="device-details-header">
//           <h2 className="device-details-title">
//             <strong>Device Name || </strong><span className="device-name">NICO{id}</span>
//           </h2>
//           <div className="device-details-status">
//             <span className="device-connection-status">
//               <FontAwesomeIcon
//                 icon={faLink}
//                 className={`status-icon ${conn ? 'green' : 'red'}`}
//               />
//               {conn ? 'Connected' : 'Disconnected'}
//             </span>

//             <span className={`connection-badge ${isPowerOn ? 'on' : 'off'}`}>
//               {isPowerOn ? 'ON' : 'OFF'}
//             </span>
//             <span className={`connection-label ${isPowerOn ? 'green' : 'red'}`}>
//               {isPowerOn ? 'Power ON' : 'Power OFF'}
//             </span>
//           </div>
//         </div>
//         {conn && (
//           <div className="device-power-status-banner">
//             <span className={`power-badge ${isPowerOn ? 'on' : 'off'}`}>
//               {isPowerOn ? 'ON' : 'OFF'}
//             </span>
//             <span className={`power-label ${isPowerOn ? 'green' : 'red'}`}>
//               {isPowerOn ? 'Power ON' : 'Power OFF'}
//             </span>
//           </div>
//         )}
//       </div>

//       {loading && (
//         <div className="loading-backdrop">
//           <div className="loading-spinner"></div>
//           <div className="loading-text">Waiting for device...</div>
//         </div>
//       )}

//       {/* Always render the main container when not loading (connected or disconnected) */}
//       {!loading && (
//         <div className="device-detail-container">
//           {/* Basic Info Section */}
//           <div className="device-info-card">
//             <div className="device-info-header">
//               <h3 className="section-title">Device Basic Information:</h3>
//               <button className="editt-btn">
//                 <FontAwesomeIcon icon={faPencil} />Edit
//               </button>
//             </div>

//             <div className="device-info-grid">
//               <p><strong>Device Name:</strong> Random_Name</p>
//               <p><strong>Owner Name:</strong> Random_Name</p>
//               <p><strong>Owner Phone:</strong> 90354651234</p>
//               <p><strong>Device ID:</strong> NICO{id}</p>
//               <p><strong>Owner Email ID:</strong> Email ID</p>
//               <p><strong>Device Sector:</strong> Karnataka</p>
//             </div>
//           </div>

//           {/* Connection Info Section */}
//           <div className="device-info-card">
//             <div>
//               <h3 className="section-title">Device Connection Status and Subscriptions:</h3>
//               <div className="device-connection-grid">
//                 <p><strong>Connection Status:</strong> {conn ? 'Connected via Wi-Fi' : 'Disconnected'}</p>
//                 <div className="power-item">
//                   <span>System Power</span>
//                   <div className="power-toggle">
//                     <span className={nbWaiting ? "status-waiting" : ""}>      
//                       {getStatusText(nbGeneratorPower, deviceData.nbGenerator.timestamp, nbWaiting)}
//                     </span>

//                     <span className={`power-status-text ${isPowerOn ? 'on' : 'off'}`}>
//                     </span>
                    
//                     <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
//                       <input
//                         type="checkbox" 
//                         checked={isPowerOn} 
//                         onChange={() => !nbWaiting && handlePowerToggle("nb")} 
//                         disabled={nbWaiting || !conn}
//                         title={!conn ? "Device is disconnected" : undefined}
//                       />
//                       <span className="toggle-slider"></span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Device Configuration & Alerts Section - Show N/A or disable when disconnected or power is OFF */}
//           <div className="device-info-card device-power-status">
//             <div>
//               <h3 className="section-title">
//                 Device Configuration & Alerts:
//               </h3>
              
//               <div className="device-config-container">
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Pump Motor frequency:</label>
//                     <span className="config-value">
//                       {isPowerOn && conn
//                         ? (deviceData.nbGenerator.pump_motor_frequency ? `${deviceData.nbGenerator.pump_motor_frequency} Hz` : 'N/A')
//                         : 'N/A'}
//                     </span>
//                   </div>
//                   <div className="config-item">
//                     <label>Total Running Hours:</label>
//                     <span className="config-value">
//                       {isPowerOn && conn
//                         ? (deviceData.nbGenerator.total_running_hours ? `${deviceData.nbGenerator.total_running_hours} H` : 'N/A')
//                         : 'N/A'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Pump Motor Current:</label>
//                     <span className="config-value">
//                       {isPowerOn && conn
//                         ? (deviceData.nbGenerator.pump_motor_current ? `${deviceData.nbGenerator.pump_motor_current.toFixed(2)} A` : 'N/A')
//                         : 'N/A'}
//                     </span>
//                   </div>
//                   <div className="config-item">
//                     <label>Total Water Outlet Qty:</label>
//                     <span className="config-value">
//                       {isPowerOn && conn ? 'N/A' : 'N/A'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Auto Mode:</label>
//                     <div className="toggle-container">
//                       <label className="toggle-switch auto-toggle">
//                         <input
//                           type="checkbox"
//                           checked={isPowerOn && conn && autoMode}
//                           onChange={() => isPowerOn && conn && setAutoMode(!autoMode)}
//                           disabled={!isPowerOn || !conn}
//                           title={!conn ? "Device is disconnected" : undefined}
//                         />
//                         <span className="toggle-slider"></span>
//                       </label>
//                     </div>
//                   </div>
//                   <div className="config-item">
//                     <label>Auto Sequence Counter:</label>
//                     <div className="editable-field">
//                       <input
//                         type="number"
//                         value={isPowerOn && conn ? counter : 'N/A'}
//                         onChange={(e) => setCounter(e.target.value)}
//                         disabled={!isPowerOn || !conn}
//                         className={`config-input ${isEditingCounter ? 'editingg' : ''}`}
//                       />
//                       <button 
//                         onClick={() => isPowerOn && conn && setIsEditingCounter(!isEditingCounter)} 
//                         className="editt-btn"
//                         disabled={!isPowerOn || !conn}
//                         title={!conn ? "Device is disconnected" : undefined}
//                       >
//                         <FontAwesomeIcon icon={faPenToSquare } />
//                       </button>
//                       <input
//                         type="number"
//                         onChange={(e) => setCounter(e.target.value)}
//                         disabled={!isEditingCounter || !isPowerOn || !conn}
//                         className={`config-input ${isEditingCounter ? 'editing' : ''}`}
//                       />
//                       <button 
//                         className="editt-btn"
//                         disabled={!isPowerOn || !conn}
//                       >
//                         <FontAwesomeIcon icon={faCircleCheck} />
//                       </button>
//                       <span className="checkmark-icon">
//                         <FontAwesomeIcon icon={faCheck} />
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Auto Sequence ON Time:</label>
//                     <div className="editable-field">
//                       <input
//                         type="number"
//                         value={isPowerOn && conn ? onTime : 'N/A'}
//                         onChange={(e) => setOnTime(e.target.value)}
//                         disabled={!isPowerOn || !conn}
//                         className={`config-input ${isEditingOnTime ? 'editingg' : ''}`}
//                       />
//                       <button 
//                         onClick={() => isPowerOn && conn && setIsEditingOnTime(!isEditingOnTime)} 
//                         className="editt-btn"
//                         disabled={!isPowerOn || !conn}
//                         title={!conn ? "Device is disconnected" : undefined}
//                       >
//                         <FontAwesomeIcon icon={faPenToSquare} />
//                       </button>
//                       <input
//                         type="number"
//                         onChange={(e) => setOnTime(e.target.value)}
//                         disabled={!isEditingOnTime || !isPowerOn || !conn}
//                         className={`config-input ${isEditingOnTime ? 'editing' : ''}`}
//                       />
//                       <button 
//                         className="editt-btn"
//                         disabled={!isPowerOn || !conn}
//                       >
//                         <FontAwesomeIcon icon={faCircleCheck} />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="config-item">
//                     <label>Auto Sequence OFF Time:</label>
//                     <div className="editable-field">
//                       <input
//                         type="number"
//                         value={isPowerOn && conn ? offTime : 'N/A'}
//                         onChange={(e) => setOffTime(e.target.value)}
//                         disabled={!isPowerOn || !conn}
//                         className={`config-input ${isEditingOffTime ? 'editingg' : ''}`}
//                       />
//                       <button 
//                         onClick={() => isPowerOn && conn && setIsEditingOffTime(!isEditingOffTime)} 
//                         className="editt-btn"
//                         disabled={!isPowerOn || !conn}
//                         title={!conn ? "Device is disconnected" : undefined}
//                       >
//                         <FontAwesomeIcon icon={faPenToSquare } />
//                       </button>
//                       <input
//                         type="number"
//                         onChange={(e) => setOffTime(e.target.value)}
//                         disabled={!isEditingOffTime || !isPowerOn || !conn}
//                         className={`config-input ${isEditingOffTime ? 'editing' : ''}`}
//                       />
//                       <button 
//                         className="editt-btn"
//                         disabled={!isPowerOn || !conn}
//                       >
//                         <FontAwesomeIcon icon={faCircleCheck} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Only render charts when power is ON */}
//           {isPowerOn && <DeviceCharts deviceId={id} />}
          
//           {/* Show message when power is OFF */}
//           {!isPowerOn && (
//             <div className="device-info-card">
//               <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
//                 <h3>System Power is OFF</h3>
//                 <p>Turn on the system power to view sensor data and charts.</p>
//               </div>
//             </div>
//           )}

//           {/* Device Alert and Info History Section */}
//           <div className="device-info-card">
//             <div>
//               <h3 className="section-title">Device Alert and Info History:</h3>
//               {/* <table className="alert-history-table">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Category</th>
//                     <th>Descriptions</th>
//                     <th>Type</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>18/03/24</td>
//                     <td>Subscriptions</td>
//                     <td>Subscriptions ends in 15 days</td>
//                     <td>Info</td>
//                   </tr>
//                   <tr>
//                     <td>23/02/24</td>
//                     <td>Services</td>
//                     <td>Yearly Service Notification</td>
//                     <td>Info</td>
//                   </tr>
//                   <tr>
//                     <td>08/01/24</td>
//                     <td>Device Disconnected</td>
//                     <td>Device is out of Connection</td>
//                     <td>Alert</td>
//                   </tr>
//                   <tr>
//                     <td>08/01/24</td>
//                     <td>Sensor Outage</td>
//                     <td>Data reached Sensor limits</td>
//                     <td>Alert</td>
//                   </tr>
//                 </tbody>
//               </table> */}
//               <tr>
//                 <td>No Alerts to show!</td>
//               </tr>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default DeviceDetails;



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
  
//   // State for the device's display name
//   const [deviceName, setDeviceName] = useState('Loading...');

//   // State to hold detailed device info (owner, phone, etc.)
//   const [deviceInfo, setDeviceInfo] = useState({
//     owner_name: 'Loading...',
//     phone_number: 'Loading...',
//     email_id: 'Loading...',
//     location: 'Loading...',
//   });
  
//   // State structure for sensor data
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

//   // This useEffect  fetches all basic device info at once
//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch device info');
//         }
//         return response.json();
//       })
//       .then(apiResponse => {
//         if (apiResponse.status === 'success' && apiResponse.data) {
//           const { device_name, owner_name, phone_number, email_id, location } = apiResponse.data;
          
//           // Update the device name state
//           setDeviceName(device_name || 'N/A');
          
//           // Update the detailed info state
//           setDeviceInfo({
//             owner_name: owner_name || 'N/A',
//             phone_number: phone_number || 'N/A',
//             email_id: email_id || 'N/A',
//             location: location || 'N/A'
//           });
//         } else {
//           throw new Error('Invalid data structure from API');
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching device details:', error);
//         // Set error states for user feedback
//         setDeviceName('Error');
//         setDeviceInfo({
//           owner_name: 'Error',
//           phone_number: 'Error',
//           email_id: 'Error',
//           location: 'Error'
//         });
//       });
//   }, [id]); // Re-run this effect if the device id changes


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

//   // Fetch device sensor data at regular intervals
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
//             <span className="device-name">{deviceName}</span> || <span className="device-name">{id}</span>
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
//               <p><strong>Owner Name:</strong> {deviceInfo.owner_name}</p>
//               <p><strong>Owner Phone:</strong> {deviceInfo.phone_number}</p>
//               <p><strong>Device ID:</strong> {id}</p>
//               <p><strong>Owner Email ID:</strong> {deviceInfo.email_id}</p>
//               <p><strong>Device Sector:</strong> {deviceInfo.location}</p>
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

//           {/* Device Configuration & Alerts Section - Show N/A or disable when disconnected or power is OFF */}
//                 <div className="device-info-card device-power-status">
//                   <div>
//                     <h3 className="section-title">
//                       Device Configuration & Alerts:
//                     </h3>
                    
//                     <div className="device-config-container">
//                       <div className="config-row">
//                         <div className="config-item">
//                           <label>Pump Motor frequency:</label>
//                           <span className="config-value">
//                             {isPowerOn && conn
//                               ? (deviceData.nbGenerator.pump_motor_frequency ? `${deviceData.nbGenerator.pump_motor_frequency} Hz` : 'N/A')
//                               : 'N/A'}
//                           </span>
//                         </div>
//                         <div className="config-item">
//                           <label>Total Running Hours:</label>
//                           <span className="config-value">
//                             {isPowerOn && conn
//                               ? (deviceData.nbGenerator.total_running_hours ? `${deviceData.nbGenerator.total_running_hours} H` : 'N/A')
//                               : 'N/A'}
//                           </span>
//                         </div>
//                       </div>
      
//                       <div className="config-row">
//                         <div className="config-item">
//                           <label>Pump Motor Current:</label>
//                           <span className="config-value">
//                             {isPowerOn && conn
//                               ? (deviceData.nbGenerator.pump_motor_current ? `${deviceData.nbGenerator.pump_motor_current.toFixed(2)} A` : 'N/A')
//                               : 'N/A'}
//                           </span>
//                         </div>
//                         <div className="config-item">
//                           <label>Total Water Outlet Qty:</label>
//                           <span className="config-value">
//                             {isPowerOn && conn ? 'N/A' : 'N/A'}
//                           </span>
//                         </div>
//                       </div>
      
//                       <div className="config-row">
//                         <div className="config-item">
//                           <label>Auto Mode:</label>
//                           <div className="toggle-container">
//                             <label className="toggle-switch auto-toggle">
//                               <input
//                                 type="checkbox"
//                                 checked={isPowerOn && conn && autoMode}
//                                 onChange={() => isPowerOn && conn && setAutoMode(!autoMode)}
//                                 disabled={!isPowerOn || !conn}
//                                 title={!conn ? "Device is disconnected" : undefined}
//                               />
//                               <span className="toggle-slider"></span>
//                             </label>
//                           </div>
//                         </div>
//                         <div className="config-item">
//                           <label>Auto Sequence Counter:</label>
//                           <div className="editable-field">
//                             <input
//                               type="number"
//                               value={isPowerOn && conn ? counter : 'N/A'}
//                               onChange={(e) => setCounter(e.target.value)}
//                               disabled={!isPowerOn || !conn}
//                               className={`config-input ${isEditingCounter ? 'editingg' : ''}`}
//                             />
//                             <button 
//                               onClick={() => isPowerOn && conn && setIsEditingCounter(!isEditingCounter)} 
//                               className="editt-btn"
//                               disabled={!isPowerOn || !conn}
//                               title={!conn ? "Device is disconnected" : undefined}
//                             >
//                               <FontAwesomeIcon icon={faPenToSquare } />
//                             </button>
//                             <input
//                               type="number"
//                               onChange={(e) => setCounter(e.target.value)}
//                               disabled={!isEditingCounter || !isPowerOn || !conn}
//                               className={`config-input ${isEditingCounter ? 'editing' : ''}`}
//                             />
//                             <button 
//                               className="editt-btn"
//                               disabled={!isPowerOn || !conn}
//                             >
//                               <FontAwesomeIcon icon={faCircleCheck} />
//                             </button>
//                             <span className="checkmark-icon">
//                               <FontAwesomeIcon icon={faCheck} />
//                             </span>
//                           </div>
//                         </div>
//                       </div>
      
//                       <div className="config-row">
//                         <div className="config-item">
//                           <label>Auto Sequence ON Time:</label>
//                           <div className="editable-field">
//                             <input
//                               type="number"
//                               value={isPowerOn && conn ? onTime : 'N/A'}
//                               onChange={(e) => setOnTime(e.target.value)}
//                               disabled={!isPowerOn || !conn}
//                               className={`config-input ${isEditingOnTime ? 'editingg' : ''}`}
//                             />
//                             <button 
//                               onClick={() => isPowerOn && conn && setIsEditingOnTime(!isEditingOnTime)} 
//                               className="editt-btn"
//                               disabled={!isPowerOn || !conn}
//                               title={!conn ? "Device is disconnected" : undefined}
//                             >
//                               <FontAwesomeIcon icon={faPenToSquare} />
//                             </button>
//                             <input
//                               type="number"
//                               onChange={(e) => setOnTime(e.target.value)}
//                               disabled={!isEditingOnTime || !isPowerOn || !conn}
//                               className={`config-input ${isEditingOnTime ? 'editing' : ''}`}
//                             />
//                             <button 
//                               className="editt-btn"
//                               disabled={!isPowerOn || !conn}
//                             >
//                               <FontAwesomeIcon icon={faCircleCheck} />
//                             </button>
//                           </div>
//                         </div>
//                         <div className="config-item">
//                           <label>Auto Sequence OFF Time:</label>
//                           <div className="editable-field">
//                             <input
//                               type="number"
//                               value={isPowerOn && conn ? offTime : 'N/A'}
//                               onChange={(e) => setOffTime(e.target.value)}
//                               disabled={!isPowerOn || !conn}
//                               className={`config-input ${isEditingOffTime ? 'editingg' : ''}`}
//                             />
//                             <button 
//                               onClick={() => isPowerOn && conn && setIsEditingOffTime(!isEditingOffTime)} 
//                               className="editt-btn"
//                               disabled={!isPowerOn || !conn}
//                               title={!conn ? "Device is disconnected" : undefined}
//                             >
//                               <FontAwesomeIcon icon={faPenToSquare } />
//                             </button>
//                             <input
//                               type="number"
//                               onChange={(e) => setOffTime(e.target.value)}
//                               disabled={!isEditingOffTime || !isPowerOn || !conn}
//                               className={`config-input ${isEditingOffTime ? 'editing' : ''}`}
//                             />
//                             <button 
//                               className="editt-btn"
//                               disabled={!isPowerOn || !conn}
//                             >
//                               <FontAwesomeIcon icon={faCircleCheck} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

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
import { useNavigate } from 'react-router-dom';
import "./DeviceDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeviceCharts from "../DataChart";
import { faLink, faPencil, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";

const DeviceDetails = () => {
  const { id } = useParams();

  // Device name and owner info
  const [deviceName, setDeviceName] = useState("Loading...");
  const [deviceInfo, setDeviceInfo] = useState({
    owner_name: "Loading...",
    phone_number: "Loading...",
    email_id: "Loading...",
    location: "Loading...",
  });

  // Editing states for config inputs
  const [isWriting, setIsWriting] = useState({
    counter: false,
    onTime: false,
    offTime: false
  });

  const navigate = useNavigate();

   const handleEditClick = () => {
    navigate(`/editdevice/${id}`); 
  };

  // Function to write to registers
  const writeToRegister = async (registerType, value) => {
    if (!value || value === '') {
      alert('Please enter a valid value');
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
        alert(`Successfully written ${value} to ${registerType.replace(/_/g, ' ')}`);
        
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
        
        return true;
      }
    } catch (error) {
      console.error('Error writing to register:', error);
      alert(`Error writing to register: ${error.response?.data?.error || error.message}`);
      return false;
    } finally {
      setIsWriting(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  // Handler functions
  const handleCounterClick = async () => {
    if (counter) {
      await writeToRegister('auto_sequence_counter', counter);
    } else {
      alert('Please enter a value first');
    }
  };

  const handleOnTimeClick = async () => {
    if (onTime) {
      await writeToRegister('auto_sequence_on', onTime);
    } else {
      alert('Please enter a value first');
    }
  };

  // Add this function after your handler functions (around line 105)
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
    } else {
      alert('Please enter a value first');
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
      pump_motor_frequency: null,
      pump_motor_current: null,
      total_running_hours: null,
      auto_sequence_on_time: null,
      auto_sequence_off_time: null,
      auto_sequence_counter: null,
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

  // Owner/misc info
  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch device info");
        return r.json();
      })
      .then((resp) => {
        if (resp.status === "success" && resp.data) {
          const { owner_name, phone_number, email_id, location } = resp.data;
          setDeviceInfo({
            owner_name: owner_name || "N/A",
            phone_number: phone_number || "N/A",
            email_id: email_id || "N/A",
            location: location || "N/A",
          });
        } else {
          throw new Error("Invalid data structure from API");
        }
      })
      .catch(() => {
        setDeviceName("Error");
        setDeviceInfo({
          owner_name: "N/A",
          phone_number: "N/A",
          email_id: "N/A",
          location: "N/A",
        });
      });
  }, [id]);

  // Device list → deviceName
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

  // Connection status and initial power check
  // useEffect(() => {
  //   const fetchInitialStatus = async () => {
  //     try {
  //       // Fetch connection status
  //       const statusRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`);
  //       if (!statusRes.ok) throw new Error(`HTTP ${statusRes.status}`);
  //       const statusData = await statusRes.json();
        
  //       setConn(statusData.status === "Connected");
        
  //       // If connected, fetch initial telemetry to get alert_status
  //       if (statusData.status === "Connected") {
  //         const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
  //         if (telemetryRes.ok) {
  //           const data = await telemetryRes.json();
  //           // Check alert_status: 57 = ON, 0 = OFF
  //           const powerStatus = data.nbGenerator?.alert_status === 57;
  //           setIsPowerOn(powerStatus);
  //           console.log(`Initial power status - Alert Status: ${data.nbGenerator?.alert_status}, Power: ${powerStatus ? 'ON' : 'OFF'}`);
  //         }
  //       }
        
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching initial status:", error);
  //       setConn(false);
  //       setIsPowerOn(false);
  //       setLoading(false);
  //     }
  //   };

  //   fetchInitialStatus();
  // }, [id]);

// Connection status and initial power check
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


  // UPDATED: Poll telemetry + statuses with alert_status check
  // useEffect(() => {
  //   if (!conn) return;

  //   const fetchData = async () => {
  //     try {
  //       // Fetch telemetry
  //       const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
  //       if (!telemetryRes.ok) throw new Error(`HTTP ${telemetryRes.status}`);
  //       const data = await telemetryRes.json();

  //       setDeviceData({
  //         nbGenerator: { ...data.nbGenerator },
  //         ozoneGenerator: { ...data.ozoneGenerator },
  //         oxygenGenerator: { ...data.oxygenGenerator },
  //       });

  //       // UPDATED: Check alert_status to determine power status
  //       // alert_status: 57 = ON, 0 = OFF
  //       const currentPowerStatus = data.nbGenerator?.alert_status === 57;
        
  //       // Only update if status has changed to avoid unnecessary re-renders
  //       if (currentPowerStatus !== isPowerOn) {
  //         setIsPowerOn(currentPowerStatus);
  //         console.log(`Power status changed - Alert Status: ${data.nbGenerator?.alert_status}, Power: ${currentPowerStatus ? 'ON' : 'OFF'}`);
  //       }

  //       // Clear waiting after confirmation if status matches expected
  //       if (nbWaiting) {
  //         setNbWaiting(false);
  //       }
  //     } catch (err) {
  //       console.error("Polling error:", err);
  //       setNbWaiting(false);
  //     }
  //   };

  //   fetchData();
  //   const intervalId = setInterval(fetchData, 5000);
  //   return () => clearInterval(intervalId);
  // }, [id, conn, nbWaiting, isPowerOn]);

// UPDATED: Poll telemetry + power status check
useEffect(() => {
  if (!conn) return;

  const fetchData = async () => {
    try {
      // Fetch telemetry for display data
      const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
      if (!telemetryRes.ok) throw new Error(`HTTP ${telemetryRes.status}`);
      const data = await telemetryRes.json();

      setDeviceData({
        nbGenerator: { ...data.nbGenerator },
        ozoneGenerator: { ...data.ozoneGenerator },
        oxygenGenerator: { ...data.oxygenGenerator },
      });

      // NEW: Use the check-power endpoint for real-time status
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
      console.error("Polling error:", err);
      setNbWaiting(false);
    }
  };

  fetchData();
  const intervalId = setInterval(fetchData, 5000);
  return () => clearInterval(intervalId);
}, [id, conn, nbWaiting, isPowerOn]);




  const handlePowerToggle = () => {
    const desired = !isPowerOn;

    setNbWaiting(true);

    if (!conn) {
      setNbWaiting(false);
      return;
    }

    // Optimistic UI update
    setIsPowerOn(desired);

    fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/nb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: desired ? "on" : "off" }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(() => {
        // Don't set nbWaiting to false here, let the polling handle it
        // when it confirms the actual status change
        console.log(`Toggle command sent: ${desired ? 'ON' : 'OFF'}`);
      })
      .catch((err) => {
        console.error("Error updating power status:", err);
        setIsPowerOn(!desired);  // Revert on error
        setNbWaiting(false);
        alert("Error updating power status. Please try again.");
      });
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
          {/* Basic Info */}
          <div className="device-info-card">
            <div className="device-info-header">
              <h3 className="section-title">Device Basic Information:</h3>
              <button className="editt-btn" onClick={handleEditClick}>
                <FontAwesomeIcon icon={faPencil} />
                Edit
              </button>
            </div>
            <div className="device-info-grid">
              <p>
                <strong>Device Name:</strong> {deviceName}
              </p>
              <p>
                <strong>Owner Name:</strong> {deviceInfo.owner_name}
              </p>
              <p>
                <strong>Owner Phone:</strong> {deviceInfo.phone_number}
              </p>
              <p>
                <strong>Device ID:</strong> {id}
              </p>
              <p>
                <strong>Owner Email ID:</strong> {deviceInfo.email_id}
              </p>
              <p>
                <strong>Device Sector:</strong> {deviceInfo.location}
              </p>
            </div>
          </div>

          {/* Connection + Power (single NB toggle) */}
          <div className="device-info-card">
            <div>
              <h3 className="section-title">Device Connection Status and Power:</h3>
              <div className="device-connection-grid">
                <p>
                  <strong>Connection Status:</strong> {conn ? "Connected via Wi-Fi" : "Disconnected"}
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
          </div>

          {/* Device Configuration & Alerts */}
          <div className="device-info-card device-power-status">
            <div>
              <h3 className="section-title">Device Configuration & Alerts:</h3>

              <div className="device-config-container">
                <div className="config-row">
                  <div className="config-item">
                    <label>Pump Motor frequency:</label>
                    <span className="config-value">
                      {isPowerOn && conn
                        ? deviceData.nbGenerator.pump_motor_frequency
                          ? `${deviceData.nbGenerator.pump_motor_frequency} Hz`
                          : "N/A"
                        : "N/A"}
                    </span>
                  </div>
                  <div className="config-item">
                    <label>Total Running Hours:</label>
                    <span className="config-value">
                      {isPowerOn && conn
                        ? deviceData.nbGenerator.total_running_hours
                          ? `${deviceData.nbGenerator.total_running_hours} H`
                          : "N/A"
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="config-row">
                  <div className="config-item">
                    <label>Pump Motor Current:</label>
                    <span className="config-value">
                      {isPowerOn && conn
                        ? deviceData.nbGenerator.pump_motor_current !== null
                          ? `${Number(deviceData.nbGenerator.pump_motor_current).toFixed(2)} A`
                          : "N/A"
                        : "N/A"}
                    </span>
                  </div>
                  <div className="config-item">
                    <label>Total Water Outlet Qty:</label>
                    <span className="config-value">N/A</span>
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
                           disabled={true}
                         />
                         <span className="toggle-slider"></span>
                       </label>
                     </div>
                   </div>
                   <div className="config-item">
                    <label>Auto Sequence Counter:</label>
                    <div className="editable-field">
                      {/* Left input - always shows current value */}
                      <input
                        type="number"
                        value={
                          isPowerOn && conn
                            ? deviceData.nbGenerator.auto_sequence_counter !== null
                              ? deviceData.nbGenerator.auto_sequence_counter
                              : "N/A"
                            : "N/A"
                        }
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                      />
                      {/* Right input - for entering new value */}
                      <input
                        type="number"
                        value={counter}
                        onChange={(e) => setCounter(e.target.value)}
                        placeholder="Enter value"
                        className="config-input editing"
                        disabled={isWriting.counter}
                        min="0"
                        max="65535"
                      />
                      <button 
                        className="editt-btn" 
                        onClick={handleCounterClick}
                        disabled={!isPowerOn || !conn || isWriting.counter}
                        title={counter ? "Click to write value" : "Enter a value first"}
                      >
                        {isWriting.counter ? (
                          <span className="spinner">⟳</span>
                        ) : (
                          <FontAwesomeIcon icon={faCircleCheck} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="config-row">
                  <div className="config-item">
                    <label>Auto Sequence ON Time:</label>
                    <div className="editable-field">
                      {/* Left input - always shows current value */}
                      <input
                        type="number"
                        value={
                          isPowerOn && conn
                            ? deviceData.nbGenerator.auto_sequence_on_time !== null
                              ? deviceData.nbGenerator.auto_sequence_on_time
                              : "N/A"
                            : "N/A"
                        }
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                      />
                      {/* Right input - for entering new value */}
                      <input
                        type="number"
                        value={onTime}
                        onChange={(e) => setOnTime(e.target.value)}
                        placeholder="Enter value"
                        className="config-input editing"
                        disabled={isWriting.onTime}
                        min="0"
                        max="65535"
                      />
                      <button 
                        className="editt-btn" 
                        onClick={handleOnTimeClick}
                        disabled={!isPowerOn || !conn || isWriting.onTime}
                        title={onTime ? "Click to write value" : "Enter a value first"}
                      >
                        {isWriting.onTime ? (
                          <span className="spinner">⟳</span>
                        ) : (
                          <FontAwesomeIcon icon={faCircleCheck} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="config-item">
                    <label>Auto Sequence OFF Time:</label>
                    <div className="editable-field">
                      {/* Left input - always shows current value */}
                      <input
                        type="number"
                        value={
                          isPowerOn && conn
                            ? deviceData.nbGenerator.auto_sequence_off_time !== null
                              ? deviceData.nbGenerator.auto_sequence_off_time
                              : "N/A"
                            : "N/A"
                        }
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                      />
                      {/* Right input - for entering new value */}
                      <input
                        type="number"
                        value={offTime}
                        onChange={(e) => setOffTime(e.target.value)}
                        placeholder="Enter value"
                        className="config-input editing"
                        disabled={isWriting.offTime}
                        min="0"
                        max="65535"
                      />
                      <button 
                        className="editt-btn" 
                        onClick={handleOffTimeClick}
                        disabled={!isPowerOn || !conn || isWriting.offTime}
                        title={offTime ? "Click to write value" : "Enter a value first"}
                      >
                        {isWriting.offTime ? (
                          <span className="spinner">⟳</span>
                        ) : (
                          <FontAwesomeIcon icon={faCircleCheck} />
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