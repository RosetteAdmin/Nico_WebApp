import React, { useState } from 'react';

const AddNewDevice = () => {
    // State variables to store input values
    const [deviceId, setDeviceId] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [sector, setSector] = useState('');
    const [status, setStatus] = useState('active');
    const [mode, setMode] = useState('auto');
    const [alerts, setAlerts] = useState(false);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const newDevice = {
            deviceId,
            deviceName,
            sector,
            status,
            mode,
            alerts
        };
        console.log('New Device:', newDevice);
        alert('Device added successfully!');
        // Reset form
        setDeviceId('');
        setDeviceName('');
        setSector('');
        setStatus('active');
        setMode('auto');
        setAlerts(false);
    };
    return(
        <div className="add-device">
            <h1>Add New Device</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="deviceId">Device ID:</label>
                    <input
                        type="text"
                        id="deviceId"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="deviceName">Device Name:</label>
                    <input
                        type="text"
                        id="deviceName"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="sector">Sector:</label>
                    <input
                        type="text"
                        id="sector"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="mode">Mode:</label>
                    <select
                        id="mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="auto">Auto</option>
                        <option value="manual">Manual</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="alerts">Alerts:</label>
                    <input
                        type="checkbox"
                        id="alerts"
                        checked={alerts}
                        onChange={(e) => setAlerts(e.target.checked)}
                    />
                </div>
                <button type="submit">Add Device</button>
            </form>
        </div>
    );
};
export default AddNewDevice;