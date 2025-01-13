import React, { useState } from 'react';
import './AddNewDevice.css'

const AddNewDevice = () => {
    // State variables to store input values
    const [deviceId, setDeviceId] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [sector, setSector] = useState('');
    const [status, setStatus] = useState('active');
    const [mode, setMode] = useState('auto');
    const [alerts, setAlerts] = useState('auto');
    const [emailId, setEmailId] = useState('');
    const [deviceOwner, setDeviceOwner] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const newDevice = {
            deviceName,
            deviceId,
            deviceOwner,
            emailId,
            phoneNumber,
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
        setAlerts('auto');
        setDeviceOwner('');
        setPhoneNumber('');
    };

    return (
        <div className="add-device">
            <h1>Add New Device</h1>
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="deviceOwner">Device Owner:</label>
                    <input
                        type="text"
                        id="deviceOwner"
                        value={deviceOwner}
                        onChange={(e) => setDeviceOwner(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="emailId">Email ID:</label>
                    <input
                        type="email"
                        id="emailId"
                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        required
                        disabled={!!emailId} // Disable editing once a value is entered
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
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
                    <label htmlFor="status">Device Type:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="NS03">NS03</option>
                        <option value="NS04">NS04</option>
                        <option value="NS05">NS05</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="mode">Subscription Type:</label>
                    <select
                        id="mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                    >
                        <option value="premium">Premium</option>
                        <option value="freemium">Freemium</option>
                        <option value="trialVariant">Trial Variant</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="alerts">Monitory Type:</label>
                    <select
                        id="alerts"
                        value={alerts}
                        onChange={(e) => setAlerts(e.target.value)}
                    >
                        <option value="deviceOwner">Device Owner</option>
                        <option value="thirdPartyVendors">Third Party Vendors</option>
                        <option value="sourceCompany">Source Company</option>
                    </select>
                </div>
                <button type="submit">Add Device</button>
            </form>
        </div>
    );
};

export default AddNewDevice;
