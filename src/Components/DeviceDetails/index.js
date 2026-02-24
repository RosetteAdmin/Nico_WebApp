
// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
// import "./DeviceDetails.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import DeviceCharts from "../DataChart";
// import { faLink, faPencil, faCheck, faSave } from "@fortawesome/free-solid-svg-icons";
// import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
// import axios from "axios";

// const DeviceDetails = () => {
//   const { id } = useParams();
  
//   // ✅ Ref to track if we're waiting for a power toggle command
//   const isWaitingRef = useRef(false);
  
//   // ✅ Ref to track if we're waiting for an auto mode toggle command
//   const isAutoWaitingRef = useRef(false);
  
//   // ✅ NEW: Ref to track when auto mode was last toggled (for cooldown protection)
//   const autoModeToggleTimeRef = useRef(0);
  
//   // ✅ NEW: Ref to track when power was last toggled (for cooldown protection)
//   const powerToggleTimeRef = useRef(0);

//   /**
//    * Helper function to check 4th bit from right (bit index 3) of alert_status
//    * Bit positions: ...bit7 bit6 bit5 bit4 bit3 bit2 bit1 bit0
//    * We check bit at index 3 (4th from right) for Pump_On_FBK (Power Status)
//    * @param {number} statusValue - The alert_status value
//    * @returns {boolean} - true if 4th bit is 1 (ON), false if 0 (OFF)
//    */
//   const checkPowerStatusFromBit = (statusValue) => {
//     if (statusValue === null || statusValue === undefined) return false;
//     const fourthBit = (statusValue >> 3) & 1;
//     const isOn = fourthBit === 1;
    
//     console.log(`🔌 Power Status Bit Check:`, {
//       statusValue,
//       binary: statusValue.toString(2).padStart(16, '0'),
//       fourthBitFromRight: fourthBit,
//       powerStatus: isOn ? 'ON' : 'OFF'
//     });
    
//     return isOn;
//   };

//   /**
//    * ✅ Helper function to check 9th bit from right (bit index 8) of alert_status for Auto mode
//    * Bit positions: ...bit15 bit14 ... bit8 bit7 bit6 bit5 bit4 bit3 bit2 bit1 bit0
//    * We check bit at index 8 (9th from right)
//    * @param {number} statusValue - The alert_status value
//    * @returns {boolean} - true if 9th bit is 1 (Auto ON), false if 0 (Auto OFF)
//    */
//   const checkAutoModeFromBit = (statusValue) => {
//     if (statusValue === null || statusValue === undefined) return false;
//     const ninthBit = (statusValue >> 8) & 1;
//     const isAutoOn = ninthBit === 1;
    
//     console.log(`🔄 Auto Mode Bit Check:`, {
//       statusValue,
//       binary: statusValue.toString(2).padStart(16, '0'),
//       ninthBitFromRight: ninthBit,
//       autoMode: isAutoOn ? 'ON' : 'OFF'
//     });
    
//     return isAutoOn;
//   };

//   // State declarations
//   const [powerStatusHistory, setPowerStatusHistory] = useState([]);
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [autoWaiting, setAutoWaiting] = useState(false);
//   const [deviceName, setDeviceName] = useState("Loading...");
//   const [deviceInfo, setDeviceInfo] = useState({
//     owner_name: "Loading...",
//     phone_number: "Loading...",
//     email_id: "Loading...",
//     location: "Loading...",
//   });

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editableInfo, setEditableInfo] = useState({
//     owner_name: "",
//     phone_number: "",
//     email_id: "",
//     location: ""
//   });

//   const [isWriting, setIsWriting] = useState({
//     counter: false,
//     onTime: false,
//     offTime: false
//   });

//   const [writeSuccess, setWriteSuccess] = useState({
//     counter: false,
//     onTime: false,
//     offTime: false
//   });

//   const [lastWritten, setLastWritten] = useState({
//     counter: "",
//     onTime: "",
//     offTime: ""
//   });

//   const navigate = useNavigate();

//   // Device data state
//   const [deviceData, setDeviceData] = useState({
//     nbGenerator: {
//       flowRate: "",
//       pressure: "",
//       waterTemperature: "",
//       systemTemperature: "",
//       totalWaterOutlet: "",
//       pump_motor_frequency: 0,
//       pump_motor_current: 0,
//       total_running_hours: 0,
//       auto_sequence_on_time: 0,
//       auto_sequence_off_time: 0,
//       auto_sequence_counter: 0,
//       auto_sequence_on_write: 0,
//       auto_sequence_off_write: 0,
//       auto_sequence_counter_write: 0,
//       oxygen_flow: 0,
//       spare_1: 0,
//       alert_status: 0,
//       timestamp: "",
//     },
//     ozoneGenerator: {
//       flowRate: "",
//       pressure: "",
//       waterTemperature: "",
//       systemTemperature: "",
//       totalWaterOutlet: "",
//       timestamp: "",
//     },
//     oxygenGenerator: {
//       flowRate: "",
//       pressure: "",
//       waterTemperature: "",
//       systemTemperature: "",
//       totalWaterOutlet: "",
//       timestamp: "",
//     },
//   });

//   const [loading, setLoading] = useState(true);
//   const [conn, setConn] = useState(false);
//   const [nbWaiting, setNbWaiting] = useState(false);
//   const [autoMode, setAutoMode] = useState(false);
//   const [onTime, setOnTime] = useState("");
//   const [offTime, setOffTime] = useState("");
//   const [counter, setCounter] = useState("");
//   const [isPowerOn, setIsPowerOn] = useState(false);

//   // ✅ Cooldown constants (in milliseconds)
//   const POWER_COOLDOWN_MS = 10000;  // 10 seconds cooldown for power toggle
//   const AUTO_MODE_COOLDOWN_MS = 10000;  // 10 seconds cooldown for auto mode toggle

//   // Fetch power status history
//   const fetchPowerStatusHistory = async () => {
//     if (!conn) return;
    
//     setLoadingHistory(true);
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_EP}/data/devices/${id}/power-status-history?limit=20`
//       );
      
//       if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
//       const data = await response.json();
      
//       if (data.status === 'success') {
//         setPowerStatusHistory(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching power status history:', error);
//     } finally {
//       setLoadingHistory(false);
//     }
//   };

//   // ✅ UPDATED: Fetch device data from database with cooldown protection for both power and auto mode
//   const fetchDeviceData = async () => {
//     try {
//       console.log('📊 [fetchDeviceData] Fetching telemetry from database...');
//       const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
      
//       if (!telemetryRes.ok) {
//         console.error(`❌ [fetchDeviceData] HTTP ${telemetryRes.status}`);
//         return;
//       }
      
//       const data = await telemetryRes.json();
//       console.log('📊 [fetchDeviceData] Received:', {
//         alert_status: data.nbGenerator?.alert_status,
//         timestamp: data.nbGenerator?.timestamp
//       });

//       // Update device data state
//       setDeviceData({
//         nbGenerator: { 
//           ...data.nbGenerator,
//           pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0,
//           pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0,
//           total_running_hours: data.nbGenerator?.total_running_hours ?? 0,
//           auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0,
//           auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0,
//           auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0,
//           auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0,      
//           auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0,    
//           auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0,
//           oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0,
//           spare_1: data.nbGenerator?.spare_1 ?? 0,
//           alert_status: data.nbGenerator?.alert_status ?? 0
//         },
//         ozoneGenerator: { ...data.ozoneGenerator },
//         oxygenGenerator: { ...data.oxygenGenerator },
//       });

//       const alertStatus = data.nbGenerator?.alert_status;

//       // ✅ FIXED: Update power status with cooldown protection
//       if (!isWaitingRef.current) {
//         const timeSincePowerToggle = Date.now() - powerToggleTimeRef.current;
        
//         if (timeSincePowerToggle > POWER_COOLDOWN_MS) {
//           const newPowerStatus = checkPowerStatusFromBit(alertStatus);
          
//           setIsPowerOn(prevStatus => {
//             if (prevStatus !== newPowerStatus) {
//               console.log(`🔌 [fetchDeviceData] Power status changed: ${prevStatus ? 'ON' : 'OFF'} → ${newPowerStatus ? 'ON' : 'OFF'}`);
//               return newPowerStatus;
//             }
//             return prevStatus;
//           });
//         } else {
//           console.log(`⏳ [fetchDeviceData] Skipping power update - cooldown active (${Math.round((POWER_COOLDOWN_MS - timeSincePowerToggle) / 1000)}s remaining)`);
//         }
//       } else {
//         console.log('⏳ [fetchDeviceData] Skipping power update - waiting for toggle response');
//       }

//       // ✅ FIXED: Update auto mode status with cooldown protection
//       if (!isAutoWaitingRef.current) {
//         const timeSinceAutoToggle = Date.now() - autoModeToggleTimeRef.current;
        
//         if (timeSinceAutoToggle > AUTO_MODE_COOLDOWN_MS) {
//           const newAutoMode = checkAutoModeFromBit(alertStatus);
          
//           setAutoMode(prevMode => {
//             if (prevMode !== newAutoMode) {
//               console.log(`🔄 [fetchDeviceData] Auto mode changed: ${prevMode ? 'ON' : 'OFF'} → ${newAutoMode ? 'ON' : 'OFF'}`);
//               return newAutoMode;
//             }
//             return prevMode;
//           });
//         } else {
//           console.log(`⏳ [fetchDeviceData] Skipping auto mode update - cooldown active (${Math.round((AUTO_MODE_COOLDOWN_MS - timeSinceAutoToggle) / 1000)}s remaining)`);
//         }
//       } else {
//         console.log('⏳ [fetchDeviceData] Skipping auto mode update - waiting for toggle response');
//       }

//       if (nbWaiting) {
//         setNbWaiting(false);
//       }
      
//     } catch (err) {
//       console.error("❌ [fetchDeviceData] Error:", err);
//       setNbWaiting(false);
//     }
//   };

//   // Function to write to registers
//   const writeToRegister = async (registerType, value) => {
//     if (!value || value === '') {
//       return false;
//     }

//     const fieldMap = {
//       'auto_sequence_counter': 'counter',
//       'auto_sequence_on': 'onTime',
//       'auto_sequence_off': 'offTime'
//     };
    
//     const fieldName = fieldMap[registerType];
//     setIsWriting(prev => ({ ...prev, [fieldName]: true }));

//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_EP}/api/devices/${id}/write-register`,
//         {
//           registerType: registerType,
//           value: parseInt(value)
//         }
//       );

//       if (response.data.success) {
//         setWriteSuccess(prev => ({ ...prev, [fieldName]: true }));
//         setLastWritten(prev => ({ ...prev, [fieldName]: value }));
        
//         switch(registerType) {
//           case 'auto_sequence_counter':
//             setCounter('');
//             break;
//           case 'auto_sequence_on':
//             setOnTime('');
//             break;
//           case 'auto_sequence_off':
//             setOffTime('');
//             break;
//           default:
//             break;
//         }
        
//         setTimeout(() => {
//           setWriteSuccess(prev => ({ ...prev, [fieldName]: false }));
//         }, 5000);
        
//         await fetchDeviceData();
//         return true;
//       }
//     } catch (error) {
//       console.error('Error writing to register:', error);
//       return false;
//     } finally {
//       setIsWriting(prev => ({ ...prev, [fieldName]: false }));
//     }
//   };

//   const handleCounterClick = async () => {
//     if (counter) {
//       await writeToRegister('auto_sequence_counter', counter);
//     } 
//   };

//   const handleOnTimeClick = async () => {
//     if (onTime) {
//       await writeToRegister('auto_sequence_on', onTime);
//     } 
//   };

//   const handleOffTimeClick = async () => {
//     if (offTime) {
//       await writeToRegister('auto_sequence_off', offTime);
//     } 
//   };

//   // Handle edit/save toggle
//   const handleEditToggle = async () => {
//     if (isEditMode) {
//       if (!editableInfo.email_id || !editableInfo.owner_name) {
//         alert("Please fill in both owner name and email fields");
//         return;
//       }

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (editableInfo.email_id !== "N/A" && !emailRegex.test(editableInfo.email_id)) {
//         alert("Please enter a valid email address");
//         return;
//       }

//       const confirmUpdate = window.confirm("Are you sure you want to update this device?");
//       if (!confirmUpdate) return;

//       setLoading(true);

//       try {
//         const response = await fetch(`${process.env.REACT_APP_EP}/data/updatedevice`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             azure_device_id: id,
//             owner_name: editableInfo.owner_name,
//             email_id: editableInfo.email_id,
//             phone_number: editableInfo.phone_number,
//             location: editableInfo.location
//           }),
//         });

//         const result = await response.json();

//         if (result.status === "success") {
//           alert("Device updated successfully!");
//           setDeviceInfo(editableInfo);
//           setIsEditMode(false);
//         } else {
//           alert(`Failed to update device: ${result.message}`);
//         }
//       } catch (error) {
//         console.error("Error updating device:", error);
//         alert("Failed to update device. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setIsEditMode(true);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setEditableInfo(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Fetch device owner info
//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`)
//       .then((r) => {
//         if (!r.ok) throw new Error("Failed to fetch device info");
//         return r.json();
//       })
//       .then((resp) => {
//         if (resp.status === "success" && resp.data) {
//           const { owner_name, phone_number, email_id, location } = resp.data;
//           const info = {
//             owner_name: owner_name || "N/A",
//             phone_number: phone_number || "N/A",
//             email_id: email_id || "N/A",
//             location: location || "N/A",
//           };
//           setDeviceInfo(info);
//           setEditableInfo(info);
//         } else {
//           throw new Error("Invalid data structure from API");
//         }
//       })
//       .catch(() => {
//         setDeviceName("Error");
//         const errorInfo = {
//           owner_name: "N/A",
//           phone_number: "N/A",
//           email_id: "N/A",
//           location: "N/A",
//         };
//         setDeviceInfo(errorInfo);
//         setEditableInfo(errorInfo);
//       });
//   }, [id]);

//   // Fetch device name
//   useEffect(() => {
//     let cancelled = false;
//     fetch(`${process.env.REACT_APP_EP}/api/devices`)
//       .then((r) => {
//         if (!r.ok) throw new Error(`HTTP ${r.status}`);
//         return r.json();
//       })
//       .then((payload) => {
//         const list = Array.isArray(payload) ? payload : payload.value || [];
//         const dev = (list || []).find((d) => String(d.id) === String(id));
//         if (!cancelled) setDeviceName(dev ? dev.displayName || dev.name || "N/A" : "N/A");
//       })
//       .catch(() => {
//         if (!cancelled) setDeviceName("Error");
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [id]);

//   // ✅ Initial connection status and data fetch
//   useEffect(() => {
//     const fetchInitialStatus = async () => {
//       try {
//         // Check connection status
//         const statusRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`);
//         if (!statusRes.ok) throw new Error(`HTTP ${statusRes.status}`);
//         const statusData = await statusRes.json();
        
//         const isConnected = statusData.status === "Connected";
//         setConn(isConnected);
        
//         if (isConnected) {
//           // Fetch telemetry from database and derive power status & auto mode
//           const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
//           if (telemetryRes.ok) {
//             const data = await telemetryRes.json();
            
//             // Update device data
//             setDeviceData({
//               nbGenerator: { 
//                 ...data.nbGenerator,
//                 pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0,
//                 pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0,
//                 total_running_hours: data.nbGenerator?.total_running_hours ?? 0,
//                 auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0,
//                 auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0,
//                 auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0,
//                 auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0,      
//                 auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0,    
//                 auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0,
//                 oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0,
//                 spare_1: data.nbGenerator?.spare_1 ?? 0,
//                 alert_status: data.nbGenerator?.alert_status ?? 0
//               },
//               ozoneGenerator: { ...data.ozoneGenerator },
//               oxygenGenerator: { ...data.oxygenGenerator },
//             });
            
//             const alertStatus = data.nbGenerator?.alert_status;
            
//             // ✅ Set initial power status from database (4th bit of alert_status)
//             const powerStatus = checkPowerStatusFromBit(alertStatus);
//             setIsPowerOn(powerStatus);
//             console.log(`🔌 Initial power status from DB: ${powerStatus ? 'ON' : 'OFF'}`);
            
//             // ✅ Set initial auto mode status from database (9th bit of alert_status)
//             const autoModeStatus = checkAutoModeFromBit(alertStatus);
//             setAutoMode(autoModeStatus);
//             console.log(`🔄 Initial auto mode from DB: ${autoModeStatus ? 'ON' : 'OFF'}`);
//           }
//         }
        
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching initial status:", error);
//         setConn(false);
//         setIsPowerOn(false);
//         setAutoMode(false);
//         setLoading(false);
//       }
//     };

//     fetchInitialStatus();
//   }, [id]);

//   // ✅ Single polling effect - automatically updates power status & auto mode
//   useEffect(() => {
//     if (!conn) return;
    
//     console.log('📊 [DeviceDetails] Starting automatic data polling...');
    
//     // Initial fetches
//     fetchPowerStatusHistory();
    
//     // Poll device data every 5 seconds - this will automatically update power status & auto mode
//     const dataInterval = setInterval(() => {
//       console.log('🔄 [DeviceDetails] Polling device data...');
//       fetchDeviceData();
//     }, 5000);
    
//     // Refresh power history less frequently (every 30 seconds)
//     const historyInterval = setInterval(() => {
//       fetchPowerStatusHistory();
//     }, 30000);
    
//     // Cleanup
//     return () => {
//       console.log('🛑 [DeviceDetails] Clearing polling intervals');
//       clearInterval(dataInterval);
//       clearInterval(historyInterval);
//     };
//   }, [conn, id]);

//   // ✅ FIXED: Handle power toggle with cooldown protection
//   const handlePowerToggle = async () => {
//     const desired = !isPowerOn;
//     console.log('🔌 [handlePowerToggle] Toggling to:', desired ? 'ON' : 'OFF');

//     setNbWaiting(true);
//     isWaitingRef.current = true;
//     powerToggleTimeRef.current = Date.now(); // ✅ Record toggle time for cooldown

//     if (!conn) {
//       console.warn('⚠️ [handlePowerToggle] Device not connected');
//       setNbWaiting(false);
//       isWaitingRef.current = false;
//       powerToggleTimeRef.current = 0;
//       return;
//     }

//     setIsPowerOn(desired); // Optimistic update

//     try {
//       const url = `${process.env.REACT_APP_EP}/api/devices/${id}/toggle/nb`;
//       const body = { action: desired ? "on" : "off" };
      
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),   
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `HTTP ${response.status}`);
//       }
      
//       console.log('✅ [handlePowerToggle] Toggle command sent successfully');
      
//       // ✅ FIXED: Wait longer and don't immediately fetch - let cooldown protect the optimistic update
//       setTimeout(async () => {
//         isWaitingRef.current = false;
//         setNbWaiting(false);
//         // Fetch power status history after the cooldown allows updates
//         await fetchPowerStatusHistory();
//       }, 5000);
      
//     } catch (err) {
//       console.error("❌ [handlePowerToggle] Error:", err);
//       setIsPowerOn(!desired); // Revert optimistic update
//       setNbWaiting(false);
//       isWaitingRef.current = false;
//       powerToggleTimeRef.current = 0; // ✅ Clear toggle time on error
//       alert("Error updating power status. Please try again.");
//     }
//   };

//   // ✅ FIXED: Handle auto mode toggle with cooldown protection
//   const handleAutoModeToggle = async () => {
//     const desired = !autoMode;
//     console.log('🔄 [handleAutoModeToggle] Toggling to:', desired ? 'ON' : 'OFF');
    
//     setAutoWaiting(true);
//     isAutoWaitingRef.current = true;
//     autoModeToggleTimeRef.current = Date.now(); // ✅ Record toggle time for cooldown

//     if (!conn) {
//       console.warn('⚠️ [handleAutoModeToggle] Device not connected');
//       setAutoWaiting(false);
//       isAutoWaitingRef.current = false;
//       autoModeToggleTimeRef.current = 0;
//       return;
//     }

//     setAutoMode(desired); // ✅ Optimistic update

//     try {
//       const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/auto`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           action: desired ? "on" : "off"
//         }),
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
//       const data = await response.json();
//       console.log(`✅ [handleAutoModeToggle] Auto mode toggle: ${desired ? 'ON' : 'OFF'}`, data);
      
//       // ✅ FIXED: Wait for device to process, then clear waiting state
//       // The cooldown will protect the optimistic update from being overwritten
//       setTimeout(() => {
//         isAutoWaitingRef.current = false;
//         setAutoWaiting(false);
//         // Don't immediately fetch - let the regular polling handle it after cooldown expires
//       }, 5000);
      
//     } catch (err) {
//       console.error("❌ [handleAutoModeToggle] Error toggling auto mode:", err);
//       setAutoMode(!desired); // Revert optimistic update
//       setAutoWaiting(false);
//       isAutoWaitingRef.current = false;
//       autoModeToggleTimeRef.current = 0; // ✅ Clear toggle time on error
//       alert("Error toggling auto mode. Please try again.");
//     }
//   };

//   const getStatusText = (isPowered, timestamp, isWaiting) => {
//     if (!conn) return "Disconnected";
//     if (isWaiting) return "request sent";
//     if (!isPowerOn) return "System OFF";
//     return "";
//   };

//   return (
//     <>
//       <div className="device-details-banner">
//         <div className="device-details-header">
//           <h2 className="device-details-title">
//             <span className="device-name">{deviceName}</span> ||{" "}
//             <span className="device-name">{id}</span>
//           </h2>
//           <div className="device-details-status">
//             <span className="device-connection-status">
//               <FontAwesomeIcon icon={faLink} className={`status-icon ${conn ? "green" : "red"}`} />
//               {conn ? "Connected" : "Disconnected"}
//             </span>
//             <span className={`connection-badge ${isPowerOn ? "on" : "off"}`}>{isPowerOn ? "ON" : "OFF"}</span>
//             <span className={`connection-label ${isPowerOn ? "green" : "red"}`}>
//               {isPowerOn ? "Power ON" : "Power OFF"}
//             </span>
//           </div>
//         </div>
//         {conn && (
//           <div className="device-power-status-banner">
//             <span className={`power-badge ${isPowerOn ? "on" : "off"}`}>{isPowerOn ? "ON" : "OFF"}</span>
//             <span className={`power-label ${isPowerOn ? "green" : "red"}`}>{isPowerOn ? "Power ON" : "Power OFF"}</span>
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
//           {/* Basic Info */}
//           <div className="device-info-card">
//             <div className="device-info-header">
//               <h3 className="section-title">Device Basic Information:</h3>
//               <button className="editt-btn" onClick={handleEditToggle}>
//                 <FontAwesomeIcon icon={isEditMode ? faSave : faPencil} />
//                 {isEditMode ? "Save" : "Edit"}
//               </button>
//             </div>
//             <div className="device-info-grid">
//               <p>
//                 <strong>Device Name:</strong> {deviceName}
//               </p>
//               <p className={isEditMode ? "editable-field-container" : ""}>
//                 <strong>Owner Name:</strong> 
//                 {isEditMode ? (
//                   <input
//                     type="text"
//                     value={editableInfo.owner_name}
//                     onChange={(e) => handleInputChange("owner_name", e.target.value)}
//                     className="inline-edit-input"
//                   />
//                 ) : (
//                   <span>{deviceInfo.owner_name}</span>
//                 )}
//               </p>
//               <p className={isEditMode ? "editable-field-container" : ""}>
//                 <strong>Owner Phone:</strong> 
//                 {isEditMode ? (
//                   <input
//                     type="tel"
//                     value={editableInfo.phone_number}
//                     onChange={(e) => handleInputChange("phone_number", e.target.value)}
//                     className="inline-edit-input"
//                   />
//                 ) : (
//                   <span>{deviceInfo.phone_number}</span>
//                 )}
//               </p>
//               <p>
//                 <strong>Device ID:</strong> {id}
//               </p>
//               <p className={isEditMode ? "editable-field-container" : ""}>
//                 <strong>Owner Email ID:</strong> 
//                 {isEditMode ? (
//                   <input
//                     type="email"
//                     value={editableInfo.email_id}
//                     onChange={(e) => handleInputChange("email_id", e.target.value)}
//                     className="inline-edit-input"
//                   />
//                 ) : (
//                   <span>{deviceInfo.email_id}</span>
//                 )}
//               </p>
//               <p className={isEditMode ? "editable-field-container" : ""}>
//                 <strong>Device Sector:</strong> 
//                 {isEditMode ? (
//                   <input
//                     type="text"
//                     value={editableInfo.location}
//                     onChange={(e) => handleInputChange("location", e.target.value)}
//                     className="inline-edit-input"
//                   />
//                 ) : (
//                   <span>{deviceInfo.location}</span>
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* Connection + Power section */}
//           <div className="device-info-card">
//             <div>
//               <div className="device-info-header">
//                 <h3 className="section-title">Device Connection Status and Power:</h3>
//               </div>

//               <div className="power-status-layout">
//                 {/* Left Section: Connection Status and Toggle */}
//                 <div className="power-status-left">
//                   <div className="device-connection-grid">
//                     <p>
//                       <strong>Connection Status:</strong> {conn ? "Connected" : "Disconnected"}
//                     </p>
//                     <p>
//                       <strong>Last Updated:</strong> {deviceData.nbGenerator.timestamp 
//                         ? new Date(deviceData.nbGenerator.timestamp).toLocaleString() 
//                         : 'N/A'}
//                     </p>

//                     {/* System Power Toggle */}
//                     <div className="power-item">
//                       <span>System Power </span>
//                       <div className="power-toggle">
//                         <span className={nbWaiting ? "status-waiting" : ""}>
//                           {getStatusText(isPowerOn, deviceData.nbGenerator.timestamp, nbWaiting)}
//                         </span>
//                         <label className={`toggle-switch ${nbWaiting ? "toggle-waiting" : ""}`}>
//                           <input
//                             type="checkbox"
//                             checked={isPowerOn}
//                             onChange={() => !nbWaiting && handlePowerToggle()}
//                             disabled={nbWaiting || !conn}
//                           />
//                           <span className="toggle-slider"></span>
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Section: Status History Table */}
//                 <div className="power-status-right">
//                   <h4 className="status-history-title">Power Status History:</h4>
//                   {loadingHistory ? (
//                     <div className="status-history-loading">Loading history...</div>
//                   ) : powerStatusHistory.length === 0 ? (
//                     <div className="status-history-empty">No status history available</div>
//                   ) : (
//                     <div className="status-history-table-container">
//                       <table className="status-history-table">
//                         <thead>
//                           <tr>
//                             <th>Date</th>
//                             <th>Status</th>
//                             <th>Duration</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {powerStatusHistory.map((record, index) => (
//                             <tr key={record.id} className={index === 0 ? 'current-status' : ''}>
//                               <td>
//                                 {new Date(record.timestamp).toLocaleDateString('en-GB', {
//                                   day: '2-digit',
//                                   month: 'short',
//                                   year: 'numeric',
//                                   hour: '2-digit',
//                                   minute: '2-digit'
//                                 })}
//                               </td>
//                               <td>
//                                 <span className={`status-badge ${record.status.toLowerCase()}`}>
//                                   {record.status}
//                                 </span>
//                               </td>
//                               <td>{record.duration_formatted}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Device Configuration & Alerts */}
//           <div className="device-info-card device-power-status">
//             <div>
//               <h3 className="section-title">Device Configuration & Alerts:</h3>

//               <div className="device-config-container">
//                 {/* Headings Row */}
//                 <div className="config-row headings-row"> 
//                   <div className="config-item config-item-left"></div>
//                   <div className="config-item config-item-right">
//                     <div className="config-headings">
//                       <span className="config-heading">Actual</span>
//                       <span className="config-heading">Set Value</span>
//                       <span className="config-heading">Set New Value</span>
//                       <span className="config-heading-spacer"></span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* First Row */}
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Pump Motor Frequency:</label>
//                     <span className="config-value">
//                       {deviceData.nbGenerator.pump_motor_frequency || 0} Hz
//                     </span>
//                   </div>
//                   <div className="config-item">
//                     <label>Auto Sequence Counter:</label>
//                     <div className="editable-field">
//                       <input
//                         type="number"
//                         value={deviceData.nbGenerator.auto_sequence_counter ?? 0}
//                         disabled={true}
//                         readOnly={true}
//                         className="config-input"
//                         title="Actual Counter Value"
//                       />
//                       <input
//                         type="number"
//                         value={deviceData.nbGenerator.auto_sequence_counter_write ?? 0}
//                         disabled={true}
//                         readOnly={true}
//                         className="config-input"
//                         title="Previously Written Counter Value"
//                       />
//                       <input
//                         type="number"
//                         value={counter}
//                         onChange={(e) => setCounter(e.target.value)}
//                         placeholder="Enter value"
//                         className="config-input editing"
//                         disabled={isWriting.counter}
//                         min="0"
//                         max="65535"
//                       />
//                       <button 
//                         className={`editt-btn ${writeSuccess.counter ? 'success-btn' : ''}`}
//                         onClick={handleCounterClick}
//                         disabled={!conn || isWriting.counter || !counter}
//                         title={counter ? "Click to write value" : "Enter a value first"}
//                       >
//                         {isWriting.counter ? (
//                           <span className="spinner">⟳</span>
//                         ) : (
//                           <FontAwesomeIcon icon={writeSuccess.counter ? faCheck : faCircleCheck} />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Second Row */}
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Pump Motor Current:</label>
//                     <span className="config-value">
//                       {Number(deviceData.nbGenerator.pump_motor_current || 0).toFixed(2)} A
//                     </span>
//                   </div>
//                   <div className="config-item">
//                     <label>Auto Sequence OFF Time:</label>
//                     <div className="editable-field">
//                       <input
//                         type="number"
//                         value={deviceData.nbGenerator.auto_sequence_off_time ?? 0}
//                         disabled={true}
//                         readOnly={true}
//                         className="config-input"
//                         title="Actual OFF Time"
//                       />
//                       <input
//                         type="number"
//                         value={deviceData.nbGenerator.auto_sequence_off_write ?? 0}
//                         disabled={true}
//                         readOnly={true}
//                         className="config-input"
//                         title="Previously Written OFF Time"
//                       />
//                       <input
//                         type="number"
//                         value={offTime}
//                         onChange={(e) => setOffTime(e.target.value)}
//                         placeholder="Enter value"
//                         className="config-input editing"
//                         disabled={isWriting.offTime}
//                         min="0"
//                         max="65535"
//                       />
//                       <button 
//                         className={`editt-btn ${writeSuccess.offTime ? 'success-btn' : ''}`}
//                         onClick={handleOffTimeClick}
//                         disabled={!conn || isWriting.offTime || !offTime}
//                         title={offTime ? "Click to write value" : "Enter a value first"}
//                       >
//                         {isWriting.offTime ? (
//                           <span className="spinner">⟳</span>
//                         ) : (
//                           <FontAwesomeIcon icon={writeSuccess.offTime ? faCheck : faCircleCheck} />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Third Row */}
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Total Running Hours:</label>
//                     <span className="config-value">
//                       {deviceData.nbGenerator.total_running_hours || 0} H
//                     </span>
//                   </div>
//                   <div className="config-item">
//                     <label>Auto Sequence ON Time:</label>
//                     <div className="editable-field">
//                       <input
//                         type="number"
//                         value={deviceData.nbGenerator.auto_sequence_on_time ?? 0}
//                         disabled={true}
//                         readOnly={true}
//                         className="config-input"
//                         title="Actual ON Time"
//                       />
//                       <input
//                         type="number"
//                         value={deviceData.nbGenerator.auto_sequence_on_write ?? 0}
//                         disabled={true}
//                         readOnly={true}
//                         className="config-input"
//                         title="Previously Written ON Time"
//                       />
//                       <input
//                         type="number"
//                         value={onTime}
//                         onChange={(e) => setOnTime(e.target.value)}
//                         placeholder="Enter value"
//                         className="config-input editing"
//                         disabled={isWriting.onTime}
//                         min="0"
//                         max="65535"
//                       />
//                       <button 
//                         className={`editt-btn ${writeSuccess.onTime ? 'success-btn' : ''}`}
//                         onClick={handleOnTimeClick}
//                         disabled={!conn || isWriting.onTime || !onTime}
//                         title={onTime ? "Click to write value" : "Enter a value first"}
//                       >
//                         {isWriting.onTime ? (
//                           <span className="spinner">⟳</span>
//                         ) : (
//                           <FontAwesomeIcon icon={writeSuccess.onTime ? faCheck : faCircleCheck} />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Fourth Row - Auto Mode with status display */}
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Total Water Outlet Qty:</label>
//                     <span className="config-value">
//                       {deviceData.nbGenerator.totalWaterOutlet || 0} L
//                     </span>
//                   </div>
//                   <div className="config-item">
//                     <label>Auto Mode:</label>
//                     <div className="auto-mode-toggle-container">
//                       <span className={`auto-mode-status ${autoMode ? 'on' : 'off'}`}>
//                         {autoWaiting ? 'Switching...' : (autoMode ? 'ON' : 'OFF')}
//                       </span>
//                       <label className={`auto-mode-switch ${autoWaiting ? "auto-mode-waiting" : ""}`}>
//                         <input
//                           type="checkbox"
//                           checked={autoMode}
//                           onChange={() => !autoWaiting && handleAutoModeToggle()}
//                           disabled={autoWaiting || !conn}
//                         />
//                         <span className="auto-mode-slider"></span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Fifth Row */}
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Water Flow Rate:</label>
//                     <span className="config-value">
//                       {deviceData.nbGenerator.flowRate || 0}
//                     </span>
//                   </div>
//                   <div className="config-item">
//                     <label>Oxygen Flow:</label>
//                     <span className="config-value">
//                       {deviceData.nbGenerator.oxygen_flow || 0} L/min
//                     </span>
//                   </div>
//                 </div>

//                 {/* Sixth Row */}
//                 <div className="config-row">
//                   <div className="config-item">
//                     <label>Water Pressure:</label>
//                     <span className="config-value">
//                       {deviceData.nbGenerator.pressure || 0} 
//                     </span>
//                   </div>
//                   <div className="config-item">
//                     <label>Spare 1:</label>
//                     <span className="config-value">
//                       {deviceData.nbGenerator.spare_1 || 0} L/min
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Charts */}
//           <DeviceCharts deviceId={id} />

//           {/* Device Alert and Info History */}
//           <div className="device-info-card">
//             <div>
//               <h3 className="section-title">Device Alert and Info History:</h3>
//               <div className="alert-status-info">
//                 <p><strong>Alert Status Value:</strong> {deviceData.nbGenerator.alert_status || 0}</p>
//                 <p><strong>Binary Representation:</strong> {(deviceData.nbGenerator.alert_status || 0).toString(2).padStart(16, '0')}</p>
//               </div>
//               <div className="table-wrapper">
//                 <table className="alert-info-table">
//                   <thead>
//                     <tr>
//                       <th>Auto_Mode_FBK</th>
//                       <th>Manual_Mode_FBK</th>
//                       <th>VFD_Trip_FBK</th>
//                       <th>Pump_On_FBK</th>
//                       <th>Solenoid_Valve_On_FBK</th>  
//                       <th>Oxygen_On_FBK</th>
//                       <th>LOW_OXYGEN_FLOW_ALARM</th>
//                       <th>HIGH_OXYGEN_FLOW_ALARM</th>
//                       <th>Auto Sequence Status</th>
//                       <th>Spare 2</th>
//                       <th>Spare 3</th>
//                       <th>Spare 4</th>
//                       <th>Spare 5</th>
//                       <th>Spare 6</th>
//                       <th>Spare 7</th>
//                       <th>Spare 8</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       {(() => {
//                         const alertStatus = deviceData.nbGenerator.alert_status || 0;
//                         const bits = [];
//                         for (let i = 0; i < 16; i++) {
//                           const bitValue = (alertStatus >> i) & 1;
//                           bits.push(
//                             <td key={i} className={`bit-value ${bitValue === 1 ? 'bit-on' : 'bit-off'}`}>
//                               {bitValue}
//                             </td>
//                           );
//                         }
//                         return bits;
//                       })()}
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default DeviceDetails;


import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./DeviceDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeviceCharts from "../DataChart";
import { faLink, faPencil, faCheck, faSave } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import axios from "axios";

// ==================== GAUGE COMPONENT ====================
// ==================== PREMIUM GAUGE COMPONENT ====================
const GaugeChart = React.memo(({ value, min, max, unit, label, colorStops, icon }) => {
  const canvasRef = useRef(null);
  const animatedValue = useRef(0);
  const animationRef = useRef(null);

  // ✅ Original value for display (not clamped)
  const originalValue = (() => {
    const v = Number(value);
    if (!isFinite(v) || isNaN(v)) return 0;
    return v;
  })();

  // ✅ Clamped value for gauge animation
  const safeValue = Math.min(Math.max(originalValue, min), max);

  const getColor = (val) => {
    const range = max - min;
    if (range === 0) return colorStops[0].color;
    const percentage = ((val - min) / range) * 100;
    for (let i = colorStops.length - 1; i >= 0; i--) {
      if (percentage >= colorStops[i].stop) {
        return colorStops[i].color;
      }
    }
    return colorStops[0].color;
  };

  const getGradientColors = (val) => {
    const range = max - min;
    if (range === 0) {
      return {
        primary: colorStops[0].color,
        glow: colorStops[0].glow || colorStops[0].color,
        bg: colorStops[0].bg || colorStops[0].color + '15'
      };
    }
    const percentage = ((val - min) / range) * 100;
    for (let i = colorStops.length - 1; i >= 0; i--) {
      if (percentage >= colorStops[i].stop) {
        return {
          primary: colorStops[i].color,
          glow: colorStops[i].glow || colorStops[i].color,
          bg: colorStops[i].bg || colorStops[i].color + '15'
        };
      }
    }
    return {
      primary: colorStops[0].color,
      glow: colorStops[0].glow || colorStops[0].color,
      bg: colorStops[0].bg || colorStops[0].color + '15'
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 220;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2 + 10;
    const radius = 78;
    const startAngle = Math.PI * 0.8;
    const endAngle = Math.PI * 2.2;
    const totalAngle = endAngle - startAngle;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    let isActive = true;

    const animate = () => {
      if (!isActive) return;

      const diff = safeValue - animatedValue.current;
      animatedValue.current += diff * 0.06;

      if (Math.abs(diff) < 0.01) {
        animatedValue.current = safeValue;
      }

      try {
        drawGauge(
          ctx, centerX, centerY, radius,
          startAngle, endAngle, totalAngle,
          animatedValue.current, size
        );
      } catch (err) {
        console.error('Gauge draw error:', err);
        isActive = false;
        return;
      }

      if (Math.abs(diff) > 0.01 && isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [safeValue, min, max]);

  const drawGauge = (ctx, cx, cy, r, startAngle, endAngle, totalAngle, currentVal, size) => {
    ctx.clearRect(0, 0, size, size);

    const range = max - min;
    if (range === 0) return;

    const sanitizedVal = isFinite(currentVal) ? currentVal : min;
    const percentage = Math.max(0, Math.min((sanitizedVal - min) / range, 1));

    if (!isFinite(percentage)) {
      console.warn('Non-finite percentage detected, skipping draw');
      return;
    }

    const valueAngle = startAngle + totalAngle * percentage;

    if (!isFinite(valueAngle)) {
      console.warn('Non-finite valueAngle detected, skipping draw');
      return;
    }

    const colors = getGradientColors(sanitizedVal);

    // === OUTER AMBIENT GLOW ===
    const ambientGlow = ctx.createRadialGradient(cx, cy, r - 20, cx, cy, r + 30);
    ambientGlow.addColorStop(0, colors.primary + '08');
    ambientGlow.addColorStop(0.5, colors.primary + '04');
    ambientGlow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, r + 25, 0, Math.PI * 2);
    ctx.fillStyle = ambientGlow;
    ctx.fill();

    // === BACKGROUND TRACK ===
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#e8ecf1';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // === INNER SHADOW TRACK ===
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#f1f3f6';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = '#e8ecf1';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // === COLORED PROGRESS ARC ===
    if (percentage > 0.005) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, valueAngle);
      ctx.strokeStyle = colors.primary + '25';
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, valueAngle);

      const gradX1 = cx + Math.cos(startAngle) * r;
      const gradY1 = cy + Math.sin(startAngle) * r;
      const gradX2 = cx + Math.cos(valueAngle) * r;
      const gradY2 = cy + Math.sin(valueAngle) * r;

      if (isFinite(gradX1) && isFinite(gradY1) && 
          isFinite(gradX2) && isFinite(gradY2) &&
          (gradX1 !== gradX2 || gradY1 !== gradY2)) {
        const arcGrad = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
        arcGrad.addColorStop(0, colors.primary + 'CC');
        arcGrad.addColorStop(0.5, colors.primary);
        arcGrad.addColorStop(1, colors.glow);
        ctx.strokeStyle = arcGrad;
      } else {
        ctx.strokeStyle = colors.primary;
      }

      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();

      const dotX = cx + Math.cos(valueAngle) * r;
      const dotY = cy + Math.sin(valueAngle) * r;

      if (isFinite(dotX) && isFinite(dotY)) {
        const dotGlow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 14);
        dotGlow.addColorStop(0, colors.primary + '60');
        dotGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(dotX, dotY, 14, 0, Math.PI * 2);
        ctx.fillStyle = dotGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    // === TICK MARKS ===
    const majorTicks = 5;
    const minorTicks = 25;

    for (let i = 0; i <= minorTicks; i++) {
      const tickAngle = startAngle + (totalAngle * i) / minorTicks;
      const tickPercentage = i / minorTicks;
      const isPastValue = tickPercentage <= percentage;
      const innerR = r - 17;
      const outerR = r - 13;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(tickAngle) * innerR, cy + Math.sin(tickAngle) * innerR);
      ctx.lineTo(cx + Math.cos(tickAngle) * outerR, cy + Math.sin(tickAngle) * outerR);
      ctx.strokeStyle = isPastValue ? colors.primary + '60' : '#d1d5db';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    for (let i = 0; i <= majorTicks; i++) {
      const tickAngle = startAngle + (totalAngle * i) / majorTicks;
      const tickPercentage = i / majorTicks;
      const isPastValue = tickPercentage <= percentage;
      const innerR = r - 22;
      const outerR = r - 13;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(tickAngle) * innerR, cy + Math.sin(tickAngle) * innerR);
      ctx.lineTo(cx + Math.cos(tickAngle) * outerR, cy + Math.sin(tickAngle) * outerR);
      ctx.strokeStyle = isPastValue ? colors.primary + '90' : '#9ca3af';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      const labelR = r - 32;
      const tickValue = min + ((max - min) * i) / majorTicks;
      const labelX = cx + Math.cos(tickAngle) * labelR;
      const labelY = cy + Math.sin(tickAngle) * labelR;

      ctx.save();
      ctx.fillStyle = isPastValue ? '#374151' : '#9ca3af';
      ctx.font = `${isPastValue ? '600' : '400'} 9px 'Inter', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let labelText;
      if (tickValue >= 1000) {
        labelText = `${(tickValue / 1000).toFixed(0)}k`;
      } else if (tickValue === Math.floor(tickValue)) {
        labelText = tickValue.toFixed(0);
      } else {
        labelText = tickValue.toFixed(1);
      }

      ctx.fillText(labelText, labelX, labelY);
      ctx.restore();
    }

    // === NEEDLE ===
    const needleAngle = startAngle + totalAngle * percentage;
    const needleLength = r - 10;

    if (isFinite(needleAngle)) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(needleAngle) * needleLength, cy + Math.sin(needleAngle) * needleLength);
      ctx.lineTo(cx + Math.cos(needleAngle + Math.PI / 2) * 3, cy + Math.sin(needleAngle + Math.PI / 2) * 3);
      ctx.lineTo(cx + Math.cos(needleAngle + Math.PI) * 12, cy + Math.sin(needleAngle + Math.PI) * 12);
      ctx.lineTo(cx + Math.cos(needleAngle - Math.PI / 2) * 3, cy + Math.sin(needleAngle - Math.PI / 2) * 3);
      ctx.closePath();

      const nX1 = cx + Math.cos(needleAngle + Math.PI) * 12;
      const nY1 = cy + Math.sin(needleAngle + Math.PI) * 12;
      const nX2 = cx + Math.cos(needleAngle) * needleLength;
      const nY2 = cy + Math.sin(needleAngle) * needleLength;

      if (isFinite(nX1) && isFinite(nY1) && isFinite(nX2) && isFinite(nY2) &&
          (nX1 !== nX2 || nY1 !== nY2)) {
        const needleGrad = ctx.createLinearGradient(nX1, nY1, nX2, nY2);
        needleGrad.addColorStop(0, '#6b7280');
        needleGrad.addColorStop(0.4, '#374151');
        needleGrad.addColorStop(0.8, colors.primary);
        needleGrad.addColorStop(1, colors.glow);
        ctx.fillStyle = needleGrad;
      } else {
        ctx.fillStyle = colors.primary;
      }

      ctx.fill();
      ctx.restore();
    }

    // === CENTER HUB ===
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 6;

    const outerHub = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 14);
    outerHub.addColorStop(0, '#f9fafb');
    outerHub.addColorStop(0.3, '#e5e7eb');
    outerHub.addColorStop(0.7, '#d1d5db');
    outerHub.addColorStop(1, '#9ca3af');
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = outerHub;
    ctx.fill();
    ctx.restore();

    const innerHub = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 10);
    innerHub.addColorStop(0, '#ffffff');
    innerHub.addColorStop(0.6, '#f3f4f6');
    innerHub.addColorStop(1, '#e5e7eb');
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = innerHub;
    ctx.fill();
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    const dotGrad = ctx.createRadialGradient(cx, cy - 1, 0, cx, cy, 4);
    dotGrad.addColorStop(0, colors.glow);
    dotGrad.addColorStop(1, colors.primary);
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = dotGrad;
    ctx.fill();
  };

  // ✅ Use originalValue for color (shows warning color if exceeds max)
  const currentColor = getColor(Math.min(originalValue, max));
  const colors = getGradientColors(Math.min(originalValue, max));
  const range = max - min;
  const percentage = range === 0 ? 0 : Math.min(((safeValue - min) / range) * 100, 100);

  const getStatusLabel = (pct) => {
    if (pct <= 25) return { text: 'Low', icon: '▼' };
    if (pct <= 50) return { text: 'Normal', icon: '●' };
    if (pct <= 75) return { text: 'High', icon: '▲' };
    return { text: 'Critical', icon: '⚠' };
  };

  const status = getStatusLabel(percentage);

  return (
    <div className="gauge-card" style={{ '--gauge-color': currentColor, '--gauge-glow': colors.glow }}>
      <div className="gauge-card-accent" style={{ background: `linear-gradient(90deg, ${currentColor}00, ${currentColor}, ${currentColor}00)` }} />

      <div className="gauge-card-header">
        <div className="gauge-icon-wrapper" style={{ background: colors.bg, borderColor: currentColor + '30' }}>
          <span className="gauge-icon">{icon}</span>
        </div>
        <span className="gauge-label">{label}</span>
      </div>

      <div className="gauge-canvas-wrapper">
        <canvas ref={canvasRef} className="gauge-canvas" />
        <div className="gauge-center-value">
          {/* ✅ Show ORIGINAL value, not clamped */}
          <span className="gauge-value" style={{ color: currentColor }}>
            {originalValue.toFixed(1)}
          </span>
          <span className="gauge-unit">{unit}</span>
        </div>
      </div>

      <div className="gauge-footer">
        <div className="gauge-range">
          <span className="gauge-min">{min}</span>
          <div className="gauge-progress-track">
            <div
              className="gauge-progress-fill"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${currentColor}90, ${currentColor})`
              }}
            />
            <div
              className="gauge-progress-glow"
              style={{
                width: `${percentage}%`,
                background: `linear-gradient(90deg, transparent, ${currentColor}40)`
              }}
            />
          </div>
          <span className="gauge-max">{max}</span>
        </div>

        <div className="gauge-status-badge" style={{
          color: currentColor,
          backgroundColor: colors.bg,
          borderColor: currentColor + '25'
        }}>
          <span className="gauge-status-icon">{status.icon}</span>
          <span className="gauge-status-text">{status.text}</span>
          <span className="gauge-status-pct">{percentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.min === nextProps.min &&
    prevProps.max === nextProps.max
  );
});

// ==================== ENHANCED GAUGE CONFIGURATIONS ====================
const GAUGE_CONFIGS = [
  {
    key: 'flowRate',
    dataField: 'flowRate',
    label: 'Water Flow Rate',
    unit: 'L/min',
    min: 0,
    max: 120,
    icon: '💧',
    colorStops: [
      { stop: 0, color: '#3b82f6', glow: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
      { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pressure',
    dataField: 'pressure',
    label: 'Water Pressure',
    unit: 'bar',
    min: 0,
    max: 10,
    icon: '🔵',
    colorStops: [
      { stop: 0, color: '#06b6d4', glow: '#22d3ee', bg: 'rgba(6,182,212,0.08)' },
      { stop: 30, color: '#10b981', glow: '#34d399', bg: 'rgba(16,185,129,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pumpMotorFrequency',
    dataField: 'pump_motor_frequency',
    label: 'Motor Frequency',
    unit: 'Hz',
    min: 0,
    max: 100,
    icon: '⚡',
    colorStops: [
      { stop: 0, color: '#8b5cf6', glow: '#a78bfa', bg: 'rgba(139,92,246,0.08)' },
      { stop: 30, color: '#3b82f6', glow: '#60a5fa', bg: 'rgba(59,130,246,0.08)' },
      { stop: 60, color: '#f59e0b', glow: '#fbbf24', bg: 'rgba(245,158,11,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  },
  {
    key: 'pumpMotorCurrent',
    dataField: 'pump_motor_current',
    label: 'Motor Current',
    unit: 'A',
    min: 0,
    max: 20,
    icon: '🔌',
    colorStops: [
      { stop: 0, color: '#14b8a6', glow: '#2dd4bf', bg: 'rgba(20,184,166,0.08)' },
      { stop: 30, color: '#22c55e', glow: '#4ade80', bg: 'rgba(34,197,94,0.08)' },
      { stop: 60, color: '#eab308', glow: '#facc15', bg: 'rgba(234,179,8,0.08)' },
      { stop: 85, color: '#ef4444', glow: '#f87171', bg: 'rgba(239,68,68,0.08)' }
    ]
  }
];

// ==================== MAIN COMPONENT ====================
const DeviceDetails = () => {
  const { id } = useParams();
  
  const isWaitingRef = useRef(false);
  const isAutoWaitingRef = useRef(false);
  const autoModeToggleTimeRef = useRef(0);
  const powerToggleTimeRef = useRef(0);

  const checkPowerStatusFromBit = (statusValue) => {
    if (statusValue === null || statusValue === undefined) return false;
    const fourthBit = (statusValue >> 3) & 1;
    const isOn = fourthBit === 1;
    
    console.log(`🔌 Power Status Bit Check:`, {
      statusValue,
      binary: statusValue.toString(2).padStart(16, '0'),
      fourthBitFromRight: fourthBit,
      powerStatus: isOn ? 'ON' : 'OFF'
    });
    
    return isOn;
  };

  const checkAutoModeFromBit = (statusValue) => {
    if (statusValue === null || statusValue === undefined) return false;
    const ninthBit = (statusValue >> 8) & 1;
    const isAutoOn = ninthBit === 1;
    
    console.log(`🔄 Auto Mode Bit Check:`, {
      statusValue,
      binary: statusValue.toString(2).padStart(16, '0'),
      ninthBitFromRight: ninthBit,
      autoMode: isAutoOn ? 'ON' : 'OFF'
    });
    
    return isAutoOn;
  };

  const [powerStatusHistory, setPowerStatusHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [autoWaiting, setAutoWaiting] = useState(false);
  const [deviceName, setDeviceName] = useState("Loading...");
  const [deviceInfo, setDeviceInfo] = useState({
    owner_name: "Loading...",
    phone_number: "Loading...",
    email_id: "Loading...",
    location: "Loading...",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editableInfo, setEditableInfo] = useState({
    owner_name: "",
    phone_number: "",
    email_id: "",
    location: ""
  });

  const [isWriting, setIsWriting] = useState({
    counter: false,
    onTime: false,
    offTime: false
  });

  const [writeSuccess, setWriteSuccess] = useState({
    counter: false,
    onTime: false,
    offTime: false
  });

  const [lastWritten, setLastWritten] = useState({
    counter: "",
    onTime: "",
    offTime: ""
  });

  const navigate = useNavigate();

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
      auto_sequence_on_write: 0,
      auto_sequence_off_write: 0,
      auto_sequence_counter_write: 0,
      oxygen_flow: 0,
      spare_1: 0,
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

  const [loading, setLoading] = useState(true);
  const [conn, setConn] = useState(false);
  const [nbWaiting, setNbWaiting] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [onTime, setOnTime] = useState("");
  const [offTime, setOffTime] = useState("");
  const [counter, setCounter] = useState("");
  const [isPowerOn, setIsPowerOn] = useState(false);

  const POWER_COOLDOWN_MS = 10000;
  const AUTO_MODE_COOLDOWN_MS = 10000;

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

  const fetchDeviceData = async () => {
    try {
      console.log('📊 [fetchDeviceData] Fetching telemetry from database...');
      const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
      
      if (!telemetryRes.ok) {
        console.error(`❌ [fetchDeviceData] HTTP ${telemetryRes.status}`);
        return;
      }
      
      const data = await telemetryRes.json();
      console.log('📊 [fetchDeviceData] Received:', {
        alert_status: data.nbGenerator?.alert_status,
        timestamp: data.nbGenerator?.timestamp
      });

      setDeviceData({
        nbGenerator: { 
          ...data.nbGenerator,
          pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0,
          pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0,
          total_running_hours: data.nbGenerator?.total_running_hours ?? 0,
          auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0,
          auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0,
          auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0,
          auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0,      
          auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0,    
          auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0,
          oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0,
          spare_1: data.nbGenerator?.spare_1 ?? 0,
          alert_status: data.nbGenerator?.alert_status ?? 0
        },
        ozoneGenerator: { ...data.ozoneGenerator },
        oxygenGenerator: { ...data.oxygenGenerator },
      });

      const alertStatus = data.nbGenerator?.alert_status;

      if (!isWaitingRef.current) {
        const timeSincePowerToggle = Date.now() - powerToggleTimeRef.current;
        
        if (timeSincePowerToggle > POWER_COOLDOWN_MS) {
          const newPowerStatus = checkPowerStatusFromBit(alertStatus);
          
          setIsPowerOn(prevStatus => {
            if (prevStatus !== newPowerStatus) {
              console.log(`🔌 [fetchDeviceData] Power status changed: ${prevStatus ? 'ON' : 'OFF'} → ${newPowerStatus ? 'ON' : 'OFF'}`);
              return newPowerStatus;
            }
            return prevStatus;
          });
        } else {
          console.log(`⏳ [fetchDeviceData] Skipping power update - cooldown active (${Math.round((POWER_COOLDOWN_MS - timeSincePowerToggle) / 1000)}s remaining)`);
        }
      } else {
        console.log('⏳ [fetchDeviceData] Skipping power update - waiting for toggle response');
      }

      if (!isAutoWaitingRef.current) {
        const timeSinceAutoToggle = Date.now() - autoModeToggleTimeRef.current;
        
        if (timeSinceAutoToggle > AUTO_MODE_COOLDOWN_MS) {
          const newAutoMode = checkAutoModeFromBit(alertStatus);
          
          setAutoMode(prevMode => {
            if (prevMode !== newAutoMode) {
              console.log(`🔄 [fetchDeviceData] Auto mode changed: ${prevMode ? 'ON' : 'OFF'} → ${newAutoMode ? 'ON' : 'OFF'}`);
              return newAutoMode;
            }
            return prevMode;
          });
        } else {
          console.log(`⏳ [fetchDeviceData] Skipping auto mode update - cooldown active (${Math.round((AUTO_MODE_COOLDOWN_MS - timeSinceAutoToggle) / 1000)}s remaining)`);
        }
      } else {
        console.log('⏳ [fetchDeviceData] Skipping auto mode update - waiting for toggle response');
      }

      if (nbWaiting) {
        setNbWaiting(false);
      }
      
    } catch (err) {
      console.error("❌ [fetchDeviceData] Error:", err);
      setNbWaiting(false);
    }
  };

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
        setWriteSuccess(prev => ({ ...prev, [fieldName]: true }));
        setLastWritten(prev => ({ ...prev, [fieldName]: value }));
        
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
          default:
            break;
        }
        
        setTimeout(() => {
          setWriteSuccess(prev => ({ ...prev, [fieldName]: false }));
        }, 5000);
        
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

  const handleOffTimeClick = async () => {
    if (offTime) {
      await writeToRegister('auto_sequence_off', offTime);
    } 
  };

  const handleEditToggle = async () => {
    if (isEditMode) {
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
      setIsEditMode(true);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_EP}/data/devices/${id}/info`)
  //     .then((r) => {
  //       if (!r.ok) throw new Error("Failed to fetch device info");
  //       return r.json();
  //     })
  //     .then((resp) => {
  //       if (resp.status === "success" && resp.data) {
  //         const { owner_name, phone_number, email_id, location } = resp.data;
  //         const info = {
  //           owner_name: owner_name || "N/A",
  //           phone_number: phone_number || "N/A",
  //           email_id: email_id || "N/A",
  //           location: location || "N/A",
  //         };
  //         setDeviceInfo(info);
  //         setEditableInfo(info);
  //       } else {
  //         throw new Error("Invalid data structure from API");
  //       }
  //     })
  //     .catch(() => {
  //       setDeviceName("Error");
  //       const errorInfo = {
  //         owner_name: "N/A",
  //         phone_number: "N/A",
  //         email_id: "N/A",
  //         location: "N/A",
  //       };
  //       setDeviceInfo(errorInfo);
  //       setEditableInfo(errorInfo);
  //     });
  // }, [id]);

// Replace your first useEffect (device info fetch) with this:
useEffect(() => {
  const fetchDeviceInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_EP}/data/devices/${id}/info`
      );

      // ✅ Handle 404 gracefully instead of crashing
      if (!response.ok) {
        console.warn(`⚠️ Device info endpoint returned ${response.status}`);
        const fallbackInfo = {
          owner_name: "N/A",
          phone_number: "N/A",
          email_id: "N/A",
          location: "N/A",
        };
        setDeviceInfo(fallbackInfo);
        setEditableInfo(fallbackInfo);
        return;
      }

      const resp = await response.json();

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
      }
    } catch (error) {
      console.error("Error fetching device info:", error);
      const fallbackInfo = {
        owner_name: "N/A",
        phone_number: "N/A",
        email_id: "N/A",
        location: "N/A",
      };
      setDeviceInfo(fallbackInfo);
      setEditableInfo(fallbackInfo);
    }
  };

  fetchDeviceInfo();
}, [id]);


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

  // useEffect(() => {
  //   const fetchInitialStatus = async () => {
  //     try {
  //       const statusRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/status`);
  //       if (!statusRes.ok) throw new Error(`HTTP ${statusRes.status}`);
  //       const statusData = await statusRes.json();
        
  //       const isConnected = statusData.status === "Connected";
  //       setConn(isConnected);
        
  //       if (isConnected) {
  //         const telemetryRes = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}`);
  //         if (telemetryRes.ok) {
  //           const data = await telemetryRes.json();
            
  //           setDeviceData({
  //             nbGenerator: { 
  //               ...data.nbGenerator,
  //               pump_motor_frequency: data.nbGenerator?.pump_motor_frequency ?? 0,
  //               pump_motor_current: data.nbGenerator?.pump_motor_current ?? 0,
  //               total_running_hours: data.nbGenerator?.total_running_hours ?? 0,
  //               auto_sequence_on_time: data.nbGenerator?.auto_sequence_on_time ?? 0,
  //               auto_sequence_off_time: data.nbGenerator?.auto_sequence_off_time ?? 0,
  //               auto_sequence_counter: data.nbGenerator?.auto_sequence_counter ?? 0,
  //               auto_sequence_on_write: data.nbGenerator?.auto_sequence_on_write ?? 0,      
  //               auto_sequence_off_write: data.nbGenerator?.auto_sequence_off_write ?? 0,    
  //               auto_sequence_counter_write: data.nbGenerator?.auto_sequence_counter_write ?? 0,
  //               oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0,
  //               spare_1: data.nbGenerator?.spare_1 ?? 0,
  //               alert_status: data.nbGenerator?.alert_status ?? 0
  //             },
  //             ozoneGenerator: { ...data.ozoneGenerator },
  //             oxygenGenerator: { ...data.oxygenGenerator },
  //           });
            
  //           const alertStatus = data.nbGenerator?.alert_status;
            
  //           const powerStatus = checkPowerStatusFromBit(alertStatus);
  //           setIsPowerOn(powerStatus);
  //           console.log(`🔌 Initial power status from DB: ${powerStatus ? 'ON' : 'OFF'}`);
            
  //           const autoModeStatus = checkAutoModeFromBit(alertStatus);
  //           setAutoMode(autoModeStatus);
  //           console.log(`🔄 Initial auto mode from DB: ${autoModeStatus ? 'ON' : 'OFF'}`);
  //         }
  //       }
        
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching initial status:", error);
  //       setConn(false);
  //       setIsPowerOn(false);
  //       setAutoMode(false);
  //       setLoading(false);
  //     }
  //   };

  //   fetchInitialStatus();
  // }, [id]);


// Replace your third useEffect (fetchInitialStatus) with this:
useEffect(() => {
  const fetchInitialStatus = async () => {
    try {
      const statusRes = await fetch(
        `${process.env.REACT_APP_EP}/api/devices/${id}/status`
      );

      if (!statusRes.ok) {
        console.warn(`⚠️ Status endpoint returned ${statusRes.status}`);
        setConn(false);
        setLoading(false); // ✅ Always stop loading
        return;
      }

      const statusData = await statusRes.json();
      const isConnected = statusData.status === "Connected";
      setConn(isConnected);

      if (isConnected) {
        try {
          const telemetryRes = await fetch(
            `${process.env.REACT_APP_EP}/api/devices/${id}`
          );
          if (telemetryRes.ok) {
            const data = await telemetryRes.json();

            setDeviceData({
              nbGenerator: {
                ...data.nbGenerator,
                pump_motor_frequency:
                  data.nbGenerator?.pump_motor_frequency ?? 0,
                pump_motor_current:
                  data.nbGenerator?.pump_motor_current ?? 0,
                total_running_hours:
                  data.nbGenerator?.total_running_hours ?? 0,
                auto_sequence_on_time:
                  data.nbGenerator?.auto_sequence_on_time ?? 0,
                auto_sequence_off_time:
                  data.nbGenerator?.auto_sequence_off_time ?? 0,
                auto_sequence_counter:
                  data.nbGenerator?.auto_sequence_counter ?? 0,
                auto_sequence_on_write:
                  data.nbGenerator?.auto_sequence_on_write ?? 0,
                auto_sequence_off_write:
                  data.nbGenerator?.auto_sequence_off_write ?? 0,
                auto_sequence_counter_write:
                  data.nbGenerator?.auto_sequence_counter_write ?? 0,
                oxygen_flow: data.nbGenerator?.oxygen_flow ?? 0,
                spare_1: data.nbGenerator?.spare_1 ?? 0,
                alert_status: data.nbGenerator?.alert_status ?? 0,
              },
              ozoneGenerator: { ...data.ozoneGenerator },
              oxygenGenerator: { ...data.oxygenGenerator },
            });

            const alertStatus = data.nbGenerator?.alert_status;
            setIsPowerOn(checkPowerStatusFromBit(alertStatus));
            setAutoMode(checkAutoModeFromBit(alertStatus));
          }
        } catch (telemetryError) {
          console.error("Telemetry fetch failed:", telemetryError);
        }
      }
    } catch (error) {
      console.error("Error fetching initial status:", error);
      setConn(false);
    } finally {
      // ✅ ALWAYS stop loading, no matter what happens
      setLoading(false);
    }
  };

  fetchInitialStatus();

  // ✅ Safety net: force loading off after 8 seconds
  const safetyTimer = setTimeout(() => {
    setLoading((prev) => {
      if (prev) {
        console.warn("⚠️ Safety timeout: forcing loading to false");
        return false;
      }
      return prev;
    });
  }, 8000);

  return () => clearTimeout(safetyTimer);
}, [id]);


  useEffect(() => {
    if (!conn) return;
    
    console.log('📊 [DeviceDetails] Starting automatic data polling...');
    
    fetchPowerStatusHistory();
    
    const dataInterval = setInterval(() => {
      console.log('🔄 [DeviceDetails] Polling device data...');
      fetchDeviceData();
    }, 5000);
    
    const historyInterval = setInterval(() => {
      fetchPowerStatusHistory();
    }, 30000);
    
    return () => {
      console.log('🛑 [DeviceDetails] Clearing polling intervals');
      clearInterval(dataInterval);
      clearInterval(historyInterval);
    };
  }, [conn, id]);

  const handlePowerToggle = async () => {
    const desired = !isPowerOn;
    console.log('🔌 [handlePowerToggle] Toggling to:', desired ? 'ON' : 'OFF');

    setNbWaiting(true);
    isWaitingRef.current = true;
    powerToggleTimeRef.current = Date.now();

    if (!conn) {
      console.warn('⚠️ [handlePowerToggle] Device not connected');
      setNbWaiting(false);
      isWaitingRef.current = false;
      powerToggleTimeRef.current = 0;
      return;
    }

    setIsPowerOn(desired);

    try {
      const url = `${process.env.REACT_APP_EP}/api/devices/${id}/toggle/nb`;
      const body = { action: desired ? "on" : "off" };
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),   
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      console.log('✅ [handlePowerToggle] Toggle command sent successfully');
      
      setTimeout(async () => {
        isWaitingRef.current = false;
        setNbWaiting(false);
        await fetchPowerStatusHistory();
      }, 5000);
      
    } catch (err) {
      console.error("❌ [handlePowerToggle] Error:", err);
      setIsPowerOn(!desired);
      setNbWaiting(false);
      isWaitingRef.current = false;
      powerToggleTimeRef.current = 0;
      alert("Error updating power status. Please try again.");
    }
  };

  const handleAutoModeToggle = async () => {
    const desired = !autoMode;
    console.log('🔄 [handleAutoModeToggle] Toggling to:', desired ? 'ON' : 'OFF');
    
    setAutoWaiting(true);
    isAutoWaitingRef.current = true;
    autoModeToggleTimeRef.current = Date.now();

    if (!conn) {
      console.warn('⚠️ [handleAutoModeToggle] Device not connected');
      setAutoWaiting(false);
      isAutoWaitingRef.current = false;
      autoModeToggleTimeRef.current = 0;
      return;
    }

    setAutoMode(desired);

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/api/devices/${id}/toggle/auto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: desired ? "on" : "off"
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      console.log(`✅ [handleAutoModeToggle] Auto mode toggle: ${desired ? 'ON' : 'OFF'}`, data);
      
      setTimeout(() => {
        isAutoWaitingRef.current = false;
        setAutoWaiting(false);
      }, 5000);
      
    } catch (err) {
      console.error("❌ [handleAutoModeToggle] Error toggling auto mode:", err);
      setAutoMode(!desired);
      setAutoWaiting(false);
      isAutoWaitingRef.current = false;
      autoModeToggleTimeRef.current = 0;
      alert("Error toggling auto mode. Please try again.");
    }
  };

  const getStatusText = (isPowered, timestamp, isWaiting) => {
    if (!conn) return "Disconnected";
    if (isWaiting) return "request sent";
    if (!isPowerOn) return "System OFF";
    return "";
  };

  // Helper to get gauge value from device data
// Helper to get gauge value from device data
const getGaugeValue = (dataField) => {
  const val = deviceData.nbGenerator[dataField];
  
  // Debug log - remove after fixing
  console.log(`📊 Gauge [${dataField}]:`, { raw: val, type: typeof val });
  
  // Handle null/undefined/empty
  if (val === null || val === undefined || val === '') {
    return 0;
  }
  
  // If it's already a valid number
  if (typeof val === 'number') {
    return isFinite(val) ? val : 0;
  }
  
  // If it's an object with a value property (some APIs return {value: 500})
  if (typeof val === 'object' && val !== null) {
    const innerVal = val.value ?? val.Value ?? val.v ?? 0;
    const num = Number(innerVal);
    return isFinite(num) ? num : 0;
  }
  
  // If it's a string, extract the numeric part
  if (typeof val === 'string') {
    // Try direct conversion first
    let num = Number(val);
    if (isFinite(num)) {
      return num;
    }
    
    // Extract numbers from string like "500 L/min" or "500.5 bar"
    const match = val.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (match) {
      num = parseFloat(match[0]);
      return isFinite(num) ? num : 0;
    }
  }
  
  return 0;
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

          {/* Connection + Power section */}
          <div className="device-info-card">
            <div>
              <div className="device-info-header">
                <h3 className="section-title">Device Connection Status and Power:</h3>
              </div>

              <div className="power-status-layout">
                <div className="power-status-left">
                  <div className="device-connection-grid">
                    <p>
                      <strong>Connection Status:</strong> {conn ? "Connected" : "Disconnected"}
                    </p>
                    <p>
                      <strong>Last Updated:</strong> {deviceData.nbGenerator.timestamp 
                        ? new Date(deviceData.nbGenerator.timestamp).toLocaleString() 
                        : 'N/A'}
                    </p>

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

          {/* Device Configuration & Alerts */}
          <div className="device-info-card device-power-status">
            <div>
              <h3 className="section-title">Device Configuration & Alerts:</h3>

              <div className="device-config-container">
                {/* Headings Row */}
                <div className="config-row headings-row"> 
                  <div className="config-item config-item-left"></div>
                  <div className="config-item config-item-right">
                    <div className="config-headings">
                      <span className="config-heading">Actual</span>
                      <span className="config-heading">Set Value</span>
                      <span className="config-heading">Set New Value</span>
                      <span className="config-heading-spacer"></span>
                    </div>
                  </div>
                </div>

                {/* First Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>Pump Motor Frequency:</label>
                    <span className="config-value">
                      {deviceData.nbGenerator.pump_motor_frequency || 0} Hz
                    </span>
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
                        title="Actual Counter Value"
                      />
                      <input
                        type="number"
                        value={deviceData.nbGenerator.auto_sequence_counter_write ?? 0}
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                        title="Previously Written Counter Value"
                      />
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
                        className={`editt-btn ${writeSuccess.counter ? 'success-btn' : ''}`}
                        onClick={handleCounterClick}
                        disabled={!conn || isWriting.counter || !counter}
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

                {/* Second Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>Pump Motor Current:</label>
                    <span className="config-value">
                      {Number(deviceData.nbGenerator.pump_motor_current || 0).toFixed(2)} A
                    </span>
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
                        title="Actual OFF Time"
                      />
                      <input
                        type="number"
                        value={deviceData.nbGenerator.auto_sequence_off_write ?? 0}
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                        title="Previously Written OFF Time"
                      />
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
                        className={`editt-btn ${writeSuccess.offTime ? 'success-btn' : ''}`}
                        onClick={handleOffTimeClick}
                        disabled={!conn || isWriting.offTime || !offTime}
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

                {/* Third Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>Total Running Hours:</label>
                    <span className="config-value">
                      {deviceData.nbGenerator.total_running_hours || 0} H
                    </span>
                  </div>
                  <div className="config-item">
                    <label>Auto Sequence ON Time:</label>
                    <div className="editable-field">
                      <input
                        type="number"
                        value={deviceData.nbGenerator.auto_sequence_on_time ?? 0}
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                        title="Actual ON Time"
                      />
                      <input
                        type="number"
                        value={deviceData.nbGenerator.auto_sequence_on_write ?? 0}
                        disabled={true}
                        readOnly={true}
                        className="config-input"
                        title="Previously Written ON Time"
                      />
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
                        className={`editt-btn ${writeSuccess.onTime ? 'success-btn' : ''}`}
                        onClick={handleOnTimeClick}
                        disabled={!conn || isWriting.onTime || !onTime}
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
                </div>

                {/* Fourth Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>Total Water Outlet Qty:</label>
                    <span className="config-value">
                      {deviceData.nbGenerator.totalWaterOutlet || 0} L
                    </span>
                  </div>
                  <div className="config-item">
                    <label>Auto Mode:</label>
                    <div className="auto-mode-toggle-container">
                      <span className={`auto-mode-status ${autoMode ? 'on' : 'off'}`}>
                        {autoWaiting ? 'Switching...' : (autoMode ? 'ON' : 'OFF')}
                      </span>
                      <label className={`auto-mode-switch ${autoWaiting ? "auto-mode-waiting" : ""}`}>
                        <input
                          type="checkbox"
                          checked={autoMode}
                          onChange={() => !autoWaiting && handleAutoModeToggle()}
                          disabled={autoWaiting || !conn}
                        />
                        <span className="auto-mode-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Fifth Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>Water Flow Rate:</label>
                    <span className="config-value">
                      {deviceData.nbGenerator.flowRate || 0}
                    </span>
                  </div>
                  <div className="config-item">
                    <label>Oxygen Flow:</label>
                    <span className="config-value">
                      {deviceData.nbGenerator.oxygen_flow || 0} L/min
                    </span>
                  </div>
                </div>

                {/* Sixth Row */}
                <div className="config-row">
                  <div className="config-item">
                    <label>Water Pressure:</label>
                    <span className="config-value">
                      {deviceData.nbGenerator.pressure || 0} 
                    </span>
                  </div>
                  <div className="config-item">
                    <label>Spare 1:</label>
                    <span className="config-value">
                      {deviceData.nbGenerator.spare_1 || 0} L/min
                    </span>
                  </div>
                </div>

                {/* ==================== GAUGE ROW ==================== */}
                <div className="config-gauge-row">
                  <div className="config-gauge-header">
                    <div className="config-gauge-title-wrapper">
                      <span className="config-gauge-title-icon">📡</span>
                      <h4 className="config-gauge-title">Live Sensor Readings</h4>
                    </div>
                    <div className="config-gauge-live-badge">
                      <span className="config-gauge-live-dot"></span>
                      LIVE
                    </div>
                  </div>
                  <div className="config-gauges-grid">
                    {GAUGE_CONFIGS.map((config) => (
                      <GaugeChart
                        key={config.key}
                        value={getGaugeValue(config.dataField)}
                        min={config.min}
                        max={config.max}
                        unit={config.unit}
                        label={config.label}
                        icon={config.icon}
                        colorStops={config.colorStops}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <DeviceCharts deviceId={id} />

          {/* Device Alert and Info History */}
          <div className="device-info-card">
            <div>
              <h3 className="section-title">Device Alert and Info History:</h3>
              <div className="alert-status-info">
                <p><strong>Alert Status Value:</strong> {deviceData.nbGenerator.alert_status || 0}</p>
                <p><strong>Binary Representation:</strong> {(deviceData.nbGenerator.alert_status || 0).toString(2).padStart(16, '0')}</p>
              </div>
              <div className="table-wrapper">
                <table className="alert-info-table">
                  <thead>
                    <tr>
                      <th>Auto_Mode_FBK</th>
                      <th>Manual_Mode_FBK</th>
                      <th>VFD_Trip_FBK</th>
                      <th>Pump_On_FBK</th>
                      <th>Solenoid_Valve_On_FBK</th>  
                      <th>Oxygen_On_FBK</th>
                      <th>LOW_OXYGEN_FLOW_ALARM</th>
                      <th>HIGH_OXYGEN_FLOW_ALARM</th>
                      <th>Auto Sequence Status</th>
                      <th>Spare 2</th>
                      <th>Spare 3</th>
                      <th>Spare 4</th>
                      <th>Spare 5</th>
                      <th>Spare 6</th>
                      <th>Spare 7</th>
                      <th>Spare 8</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {(() => {
                        const alertStatus = deviceData.nbGenerator.alert_status || 0;
                        const bits = [];
                        for (let i = 0; i < 16; i++) {
                          const bitValue = (alertStatus >> i) & 1;
                          bits.push(
                            <td key={i} className={`bit-value ${bitValue === 1 ? 'bit-on' : 'bit-off'}`}>
                              {bitValue}
                            </td>
                          );
                        }
                        return bits;
                      })()}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceDetails;