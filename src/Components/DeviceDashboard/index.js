import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders, faEllipsis, faAngleLeft, faAngleRight, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import "./DeviceDashboard.css";

const DeviceDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const userrole = JSON.parse(localStorage.getItem("user")).role;

  useEffect(() => {
    const fetchDevicesWithInfo = async () => {
      try {
        // Fetch devices from Azure
        const response = await fetch(`${process.env.REACT_APP_EP}/api/devices`);
        const data = await response.json();
        const azureDevices = data.value || [];

        // Fetch additional info for each device from database
        const devicesWithInfo = await Promise.all(
          azureDevices.map(async (device) => {
            try {
              // Fetch device info (owner, sector, etc.)
              const infoResponse = await fetch(`${process.env.REACT_APP_EP}/data/devices/${device.id}/info`);
              const infoData = await infoResponse.json();
              
              // Fetch connection status
              let connectionStatus = "Disconnected";
              try {
                const statusResponse = await fetch(`${process.env.REACT_APP_EP}/api/devices/${device.id}/status`);
                const statusData = await statusResponse.json();
                connectionStatus = statusData.status === "Connected" ? "Connected" : "Disconnected";
              } catch (statusError) {
                console.error(`Error fetching status for device ${device.id}:`, statusError);
              }
              
              if (infoData.status === "success" && infoData.data) {
                return {
                  ...device,
                  owner_name: infoData.data.owner_name || "N/A",
                  sector: infoData.data.location || "N/A",
                  phone_number: infoData.data.phone_number || "N/A",
                  email_id: infoData.data.email_id || "N/A",
                  status: connectionStatus
                };
              }
              
              // If info fetch fails, return device with default values
              return {
                ...device,
                owner_name: "N/A",
                sector: "N/A",
                phone_number: "N/A",
                email_id: "N/A",
                status: connectionStatus
              };
            } catch (error) {
              console.error(`Error fetching info for device ${device.id}:`, error);
              return {
                ...device,
                owner_name: "N/A",
                sector: "N/A",
                status: "Disconnected"
              };
            }
          })
        );

        setDevices(devicesWithInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching devices:', error);
        setLoading(false);
      }
    };

    fetchDevicesWithInfo();
  }, []);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter devices based on the search query
  const filteredDevices = devices.filter((device) =>
    Object.values(device)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalRows = filteredDevices.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedDevices = filteredDevices.slice(startIndex, startIndex + rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRowClick = (id) => {
    navigate(`/device/${id}`);
  };

  return (
    <>
      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner"></div>
          <div className="loading-text">Waiting for server...</div>
        </div>
      )}
      <div className="search-bar-container">
        <h2 className="dashboard-title-reg">Installed Devices</h2>

        <input
          type="text"
          placeholder="Search"
          className="search-bar"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <span className="dev-search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <button className="filter-button">
          <FontAwesomeIcon icon={faSliders} />
        </button>

        <div className="device-footer">
          <span className="pagination-info">
            {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}
          </span>
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              <span className="arrow-icon">
                <FontAwesomeIcon icon={faAngleLeft} />
              </span>
            </button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              <span className="arrow-icon">
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="device-dashboard-reg">
        <table className="device-table-reg">
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Device Name</th>
              <th>Sector</th>
              <th>Device Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedDevices.length > 0 ? (
              displayedDevices.map((device) => (
                <tr key={device.id} onClick={() => handleRowClick(device.id)} style={{ cursor: "pointer" }}>
                  <td>{device.id}</td>
                  <td>{device.displayName}</td>
                  <td>{device.sector}</td>
                  <td>{device.owner_name}</td>
                  <td>
                    <span className={`status-indicator status-${(device.status || 'Disconnected').toLowerCase()}`}>
                      {device.status || "Disconnected"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No devices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DeviceDashboard;