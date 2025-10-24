import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './DeviceMap.css';

// Fix for default marker icons 
// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom device icon (blue marker for devices)
const deviceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Current location icon (red marker)
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when position changes
const RecenterMap = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  
  return null;
};

const DeviceMap = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: India center
  const [mapZoom, setMapZoom] = useState(5);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(13);
          setLoading(false);
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setError('Unable to get your location. Showing default view.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  // Fetch devices with locations from backend (when available)
  useEffect(() => {
    const fetchDeviceLocations = async () => {
      const EP = process.env.REACT_APP_EP;
      
      try {
        const response = await fetch(`${EP}/api/devices`);
        if (!response.ok) throw new Error('Failed to fetch devices');
        
        const data = await response.json();
        
        // Filter devices that have location data
        // Assuming backend will add 'latitude' and 'longitude' fields in future
        const devicesWithLocation = (Array.isArray(data) ? data : data.data || [])
          .filter(device => device.latitude && device.longitude)
          .map(device => ({
            id: device.id || device.azure_device_id,
            name: device.device_name || device.name || 'Unknown Device',
            position: [parseFloat(device.latitude), parseFloat(device.longitude)],
            status: device.status || 'unknown',
            type: device.device_type || 'NICO Device',
          }));
        
        setDevices(devicesWithLocation);
      } catch (err) {
        console.error('Error fetching device locations:', err);
        // Don't set error here, just log it - map will still show current location
      }
    };

    fetchDeviceLocations();
    
    // Refresh device locations every 30 seconds
    const interval = setInterval(fetchDeviceLocations, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Error state UI
  if (error && !currentPosition) {
    return (
      <div className="map-error-container">
        <div className="map-error-content">
          <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
          <h3>Map Unavailable</h3>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading state UI
  if (loading) {
    return (
      <div className="map-loading-container">
        <div className="map-spinner"></div>
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="device-map-container">
      <div className="map-header">
        <h3>Device Locations</h3>
        <div className="map-legend">
          <span className="legend-item">
            <span className="legend-dot legend-current"></span> Your Location
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-device"></span> Devices ({devices.length})
          </span>
        </div>
      </div>
      
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap position={currentPosition} />
        
        {/* Current user location marker */}
        {currentPosition && (
          <Marker position={currentPosition} icon={currentLocationIcon}>
            <Popup>
              <div className="map-popup">
                <strong>Your Current Location</strong>
                <p>Lat: {currentPosition[0].toFixed(4)}</p>
                <p>Lng: {currentPosition[1].toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Device location markers */}
        {devices.map((device) => (
          <Marker 
            key={device.id} 
            position={device.position} 
            icon={deviceIcon}
          >
            <Popup>
              <div className="map-popup">
                <strong>{device.name}</strong>
                <p>Type: {device.type}</p>
                <p>Status: <span className={`status-${device.status}`}>{device.status}</span></p>
                <p>Lat: {device.position[0].toFixed(4)}</p>
                <p>Lng: {device.position[1].toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {error && (
        <div className="map-warning">
          <i className="fa fa-info-circle" aria-hidden="true"></i> {error}
        </div>
      )}
    </div>
  );
};

export default DeviceMap;