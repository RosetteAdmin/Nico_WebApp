// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./LogDetails.css";

// const LogDetails = () => {
//     const { azure_device_id } = useParams();
//     const [logs, setLogs] = useState({ latest: {}, history: [] });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchLogs = async () => {
//             try {
//                 const response = await fetch(`${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/generator-logs`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 console.log('Fetched logs:', data.data);
//                 if (data.status === 'error') {
//                     throw new Error(data.message);
//                 }
//                 setLogs(data.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching logs:", error);
//                 setError(`Failed to load generator logs: ${error.message}`);
//                 setLoading(false);
//             }
//         };

//         fetchLogs();
//     }, [azure_device_id]);

//     const insertSampleLogs = async () => {
//         const sampleLogs = {
//             nb: {
//                 flowRate: 10.5,
//                 pressure: 2.3,
//                 waterTemperature: 25.0,
//                 systemTemperature: 30.0,
//                 totalWaterOutlet: 100.0,
//                 powerStatus: true,
//                 timestamp: new Date().toISOString()
//             },
//             ozone: {
//                 flowRate: 12.0,
//                 pressure: 2.5,
//                 waterTemperature: 26.0,
//                 systemTemperature: 31.0,
//                 totalWaterOutlet: 120.0,
//                 powerStatus: false,
//                 timestamp: new Date().toISOString()
//             }
//         };

//         try {
//             setLoading(true);
//             const response = await fetch(`${process.env.REACT_APP_EP}/data/generator-logs/insert`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     device_id: azure_device_id,
//                     logs: sampleLogs
//                 })
//             });
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             const result = await response.json();
//             console.log('Insert result:', result);
//             if (result.status === 'success') {
//                 // Refresh logs after insertion
//                 const fetchResponse = await fetch(`${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/generator-logs`);
//                 if (fetchResponse.ok) {
//                     const data = await fetchResponse.json();
//                     setLogs(data.data);
//                 }
//                 setError(null);
//             } else {
//                 setError(`Failed to insert logs: ${result.message}`);
//             }
//         } catch (error) {
//             console.error("Error inserting logs:", error);
//             setError(`Failed to insert generator logs: ${error.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatValue = (value) => value !== null && value !== undefined ? Number(value).toFixed(2) : 'N/A';

//     return (
//         <div className="log-details-container">
//             <div className="log-details-header">
//                 <h2 className="log-details-title">Generator Logs for Device NICO{azure_device_id}</h2>
//                 <button onClick={insertSampleLogs} disabled={loading}>
//                     Insert Sample Logs
//                 </button>
//             </div>

//             {loading ? (
//                 <div className="loading-backdrop">
//                     <div className="loading-spinner"></div>
//                     <div className="loading-text">Loading logs...</div>
//                 </div>
//             ) : error ? (
//                 <div className="error-message"><p>{error}</p></div>
//             ) : (
//                 <>
//                     <div className="log-details-content">
//                         <h3>Latest Readings</h3>
//                         <table className="power-logs-table">
//                             <thead>
//                                 <tr>
//                                     <th>Generator Type</th>
//                                     <th>Flow Rate (L/min)</th>
//                                     <th>Pressure (bar)</th>
//                                     <th>Water Temp (°C)</th>
//                                     <th>System Temp (°C)</th>
//                                     <th>Total Water Outlet (L)</th>
//                                     <th>Power Status</th>
//                                     <th>Timestamp</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {['nb', 'ozone', 'oxygen'].map(type => (
//                                     logs.latest[type] ? (
//                                         <tr key={type}>
//                                             <td>{type.charAt(0).toUpperCase() + type.slice(1)} Generator</td>
//                                             <td>{formatValue(logs.latest[type].flowRate)}</td>
//                                             <td>{formatValue(logs.latest[type].pressure)}</td>
//                                             <td>{formatValue(logs.latest[type].waterTemperature)}</td>
//                                             <td>{formatValue(logs.latest[type].systemTemperature)}</td>
//                                             <td>{formatValue(logs.latest[type].totalWaterOutlet)}</td>
//                                             <td>{logs.latest[type].powerStatus ? 'ON' : 'OFF'}</td>
//                                             <td>{new Date(logs.latest[type].timestamp).toLocaleString()}</td>
//                                         </tr>
//                                     ) : (
//                                         <tr key={type}>
//                                             <td>{type.charAt(0).toUpperCase() + type.slice(1)} Generator</td>
//                                             <td colSpan="7">No data available</td>
//                                         </tr>
//                                     )
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     <div className="log-details-content">
//                         <h3>Historical Logs (All Generators Combined)</h3>
//                         <table className="power-logs-table">
//                             <thead>
//                                 <tr>
//                                     <th>Generator Type</th>
//                                     <th>Flow Rate (L/min)</th>
//                                     <th>Pressure (bar)</th>
//                                     <th>Water Temp (°C)</th>
//                                     <th>System Temp (°C)</th>
//                                     <th>Total Water Outlet (L)</th>
//                                     <th>Power Status</th>
//                                     <th>Timestamp</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {logs.history.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="8">No historical logs available.</td>
//                                     </tr>
//                                 ) : (
//                                     logs.history.map((log, index) => (
//                                         <tr key={index}>
//                                             <td>{log.generator_type.charAt(0).toUpperCase() + log.generator_type.slice(1)} Generator</td>
//                                             <td>{formatValue(log.flow_rate)}</td>
//                                             <td>{formatValue(log.pressure)}</td>
//                                             <td>{formatValue(log.water_temperature)}</td>
//                                             <td>{formatValue(log.system_temperature)}</td>
//                                             <td>{formatValue(log.total_water_outlet)}</td>
//                                             <td>{log.power_status ? 'ON' : 'OFF'}</td>
//                                             <td>{new Date(log.timestamp).toLocaleString()}</td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default LogDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LogDetails.css";

const LogDetails = () => {
    const { azure_device_id } = useParams();
    const [logs, setLogs] = useState({ latest: {}, history: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLogs = async () => {
        try {
            // Add cache-busting query parameter
            const response = await fetch(`${process.env.REACT_APP_EP}/data/devices/${azure_device_id}/generator-logs?ts=${Date.now()}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched logs:', data.data);
            if (data.status === 'error') {
                throw new Error(data.message);
            }
            setLogs(data.data);
            setLoading(false);
            setError(null);
        } catch (error) {
            console.error("Error fetching logs:", error);
            setError(`Failed to load generator logs: ${error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchLogs();

        // Set up polling every 30 seconds
const intervalId = setInterval(fetchLogs, 5000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [azure_device_id]);

    const formatValue = (value) => value !== null && value !== undefined ? Number(value).toFixed(2) : 'N/A';

    return (
        <div className="log-details-container">
            <div className="log-details-header">
                <h2 className="log-details-title">Generator Logs for Device NICO{azure_device_id}</h2>
            </div>

            {loading ? (
                <div className="loading-backdrop">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading logs...</div>
                </div>
            ) : error ? (
                <div className="error-message"><p>{error}</p></div>
            ) : (
                <>
                    <div className="log-details-content">
                        <h3>Latest Readings</h3>
                        <table className="power-logs-table">
                            <thead>
                                <tr>
                                    <th>Generator Type</th>
                                    <th>Flow Rate (L/min)</th>
                                    <th>Pressure (bar)</th>
                                    <th>Water Temp (°C)</th>
                                    <th>System Temp (°C)</th>
                                    <th>Total Water Outlet (L)</th>
                                    <th>Power Status</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {['nb', 'ozone', 'oxygen'].map(type => (
                                    logs.latest[type] ? (
                                        <tr key={type}>
                                            <td>{type.charAt(0).toUpperCase() + type.slice(1)} Generator</td>
                                            <td>{formatValue(logs.latest[type].flowRate)}</td>
                                            <td>{formatValue(logs.latest[type].pressure)}</td>
                                            <td>{formatValue(logs.latest[type].waterTemperature)}</td>
                                            <td>{formatValue(logs.latest[type].systemTemperature)}</td>
                                            <td>{formatValue(logs.latest[type].totalWaterOutlet)}</td>
                                            <td>{logs.latest[type].powerStatus ? 'ON' : 'OFF'}</td>
                                            <td>{new Date(logs.latest[type].timestamp).toLocaleString()}</td>
                                        </tr>
                                    ) : (
                                        <tr key={type}>
                                            <td>{type.charAt(0).toUpperCase() + type.slice(1)} Generator</td>
                                            <td colSpan="7">No data available</td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="log-details-content">
                        <h3>Historical Logs</h3>
                        <table className="power-logs-table">
                            <thead>
                                <tr>
                                    <th>Generator Type</th>
                                    <th>Flow Rate (L/min)</th>
                                    <th>Pressure (bar)</th>
                                    <th>Water Temp (°C)</th>
                                    <th>System Temp (°C)</th>
                                    <th>Total Water Outlet (L)</th>
                                    <th>Power Status</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.history.length === 0 ? (
                                    <tr>
                                        <td colSpan="8">No historical logs available.</td>
                                    </tr>
                                ) : (
                                        logs.history.slice(0, 12).map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.generator_type.charAt(0).toUpperCase() + log.generator_type.slice(1)} Generator</td>
                                            <td>{formatValue(log.flow_rate)}</td>
                                            <td>{formatValue(log.pressure)}</td>
                                            <td>{formatValue(log.water_temperature)}</td>
                                            <td>{formatValue(log.system_temperature)}</td>
                                            <td>{formatValue(log.total_water_outlet)}</td>
                                            <td>{log.power_status ? 'ON' : 'OFF'}</td>
                                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default LogDetails;