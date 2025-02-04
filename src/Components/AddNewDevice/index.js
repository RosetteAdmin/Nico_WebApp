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
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const newDevice = {
            device_name: deviceName,
            device_id: deviceId,
            owner_name: deviceOwner, // Updated to match the form field
            email: emailId, // Updated to match the form field
            phone: phoneNumber, // Updated to match the form field
            location: sector, // Updated to match the form field
            device_type: status, // Updated to match the form field
            subscription: mode, // Updated to match the form field
            monitory: alerts, // Updated to match the form field
        };
    
        try {
            const response = await fetch(`${process.env.REACT_APP_EP}/data/newdevice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDevice),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Device added successfully!');
                // Reset form fields
                setDeviceId('');
                setDeviceName('');
                setDeviceOwner('');
                setEmailId('');
                setPhoneNumber('');
                setSector('');
                setStatus('NS03');
                setMode('Premium');
                setAlerts('Device Owner');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            alert('Failed to add device. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-device">
            <div className="add-device-headerDiv">
                <h1 className="add-device-andHeader">Create New Device</h1>
                <button className="add-device-button" form="addDeviceForm" type="submit">{loading ? 'Creating...' : 'Create Now'}</button>
            </div>
            <div className="add-device-formDiv">
                <form id="addDeviceForm" className="add-device-andForm" onSubmit={handleSubmit}>
                    <h4 className='add-device-insideHeader'>Add Device Basic Information</h4>
                    <span></span>
                    <span></span>
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
                            <option value="Premium">Premium</option>
                            <option value="Freemium">Freemium</option>
                            <option value="Trial Variant">Trial Variant</option>
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
                            <option value="Device Owner">Device Owner</option>
                            <option value="Third Party Vendors">Third Party Vendors</option>
                            <option value="Source Company">Source Company</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewDevice;