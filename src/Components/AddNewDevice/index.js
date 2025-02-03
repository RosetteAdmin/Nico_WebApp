import React, { useState } from 'react';
import './AddNewDevice.css';

const AddNewDevice = () => {
    const [deviceId, setDeviceId] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [sector, setSector] = useState('');
    const [status, setStatus] = useState('active');
    const [mode, setMode] = useState('auto');
    const [alerts, setAlerts] = useState('auto');
    const [emailId, setEmailId] = useState('');
    const [deviceOwner, setDeviceOwner] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

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
            alerts,
        };
        console.log('New Device:', newDevice);
        alert('Device added successfully!');
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
            <div className="add-device-headerDiv">
                <h1 className="add-device-andHeader">Create New Device</h1>
                <button className="add-device-button" form="addDeviceForm" type="submit">Create Now</button>
            </div>
            <div className="add-device-formDiv">
                <h4 className='add-device-insideHeader'>Add Device Basic Information</h4>
                <form id="addDeviceForm" className="add-device-andForm" onSubmit={handleSubmit}>


                    <div>
                        <label className="add-device-andLabel" htmlFor="deviceName">Device Name:</label>
                        <input
                            placeholder="Name"
                            type="text"
                            id="deviceName"
                            className='add-device-input'
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="add-device-andLabel" htmlFor="deviceId">Device ID:</label>
                        <input
                            placeholder="ID"
                            type="text"
                            id="deviceId"
                            className='add-device-input'
                            value={deviceId}
                            onChange={(e) => setDeviceId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="add-device-andLabel" htmlFor="deviceOwner">Device Owner:</label>
                        <input
                            placeholder="Owner Name"
                            type="text"
                            id="deviceOwner"
                            className='add-device-input'
                            value={deviceOwner}
                            onChange={(e) => setDeviceOwner(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="add-device-andLabel" htmlFor="emailId">Email ID:</label>
                        <input
                            placeholder="example@gmail.com"
                            type="email"
                            id="emailId"
                            className='add-device-input'
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            required
                            disabled={!!emailId}
                        />
                    </div>
                    <div>
                        <label className="add-device-andLabel" htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            placeholder="Contact Number"
                            type="tel"
                            id="phoneNumber"
                            className='add-device-input'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="add-device-andLabel" htmlFor="sector">Location:</label>
                        <input
                            placeholder="Place"
                            type="text"
                            id="sector"
                            className='add-device-input'
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="add-device-andLabel" htmlFor="status">Device Type:</label>
                        <select
                            id="status"
                            value={status}
                            className='add-device-select'
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="NS03">NS03</option>
                            <option value="NS04">NS04</option>
                            <option value="NS05">NS05</option>
                        </select>
                    </div>
                    <div>
                        <label className="add-device-andLabel" htmlFor="mode">Subscription Type:</label>
                        <select
                            id="mode"
                            value={mode}
                            className='add-device-select'
                            onChange={(e) => setMode(e.target.value)}
                        >
                            <option value="premium">Premium</option>
                            <option value="freemium">Freemium</option>
                            <option value="trialVariant">Trial Variant</option>
                        </select>
                    </div>
                    <div>
                        <label className="add-device-andLabel" htmlFor="alerts">Monitory Type:</label>
                        <select
                            id="alerts"
                            className='add-device-select'
                            value={alerts}
                            onChange={(e) => setAlerts(e.target.value)}
                        >
                            <option value="deviceOwner">Device Owner</option>
                            <option value="thirdPartyVendors">Third Party Vendors</option>
                            <option value="sourceCompany">Source Company</option>
                        </select>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AddNewDevice;