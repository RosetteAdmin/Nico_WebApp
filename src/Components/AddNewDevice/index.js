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
        <div>AddNewDevice Page</div>
    );
};
export default AddNewDevice;