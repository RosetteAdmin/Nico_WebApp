import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./DeviceDashboard.css";

const DeviceDashboard = () => {
  const devices = [
    { id: "00001", name: "Christine Brooks", sector: "Karnataka, India", status: "Not Connected", mode: "-", alerts: "A1" },
    { id: "00002", name: "Rosie Pearson", sector: "Karnataka, India", status: "Connected", mode: "ON", alerts: "A2" },
    { id: "00003", name: "Darrell Caldwell", sector: "Pune, India", status: "Not Connected", mode: "ON", alerts: "A2" },
    { id: "00004", name: "Gilbert Johnston", sector: "New Delhi, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00005", name: "Alan Cain", sector: "Kerala, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00006", name: "Alfred Murray", sector: "Haryana, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00007", name: "Maggie Sullivan", sector: "Patna, India", status: "Connected", mode: "ON", alerts: "A2" },
    { id: "00008", name: "Rosie Todd", sector: "Manipal, India", status: "Connected", mode: "ON", alerts: "A2" },
    { id: "00009", name: "Christine Brooks", sector: "Karnataka, India", status: "Not Connected", mode: "-", alerts: "A1" },
    { id: "00010", name: "Rosie Pearson", sector: "Karnataka, India", status: "Connected", mode: "ON", alerts: "A2" },
    { id: "00011", name: "Darrell Caldwell", sector: "Pune, India", status: "Not Connected", mode: "ON", alerts: "A2" },
    { id: "00012", name: "Gilbert Johnston", sector: "New Delhi, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00013", name: "Alan Cain", sector: "Kerala, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00014", name: "Alfred Murray", sector: "Haryana, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00015", name: "Maggie Sullivan", sector: "Patna, India", status: "Connected", mode: "ON", alerts: "A2" },
    { id: "00016", name: "Rosie Todd", sector: "Manipal, India", status: "Connected", mode: "ON", alerts: "A2" },
    { id: "00017", name: "Christine Brooks", sector: "Karnataka, India", status: "Not Connected", mode: "-", alerts: "A1" },
    { id: "00018", name: "Rosie Pearson", sector: "Karnataka, India", status: "Connected", mode: "ON", alerts: "A2" },
    { id: "00019", name: "Darrell Caldwell", sector: "Pune, India", status: "Not Connected", mode: "ON", alerts: "A2" },
    { id: "00020", name: "Gilbert Johnston", sector: "New Delhi, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00021", name: "Alan Cain", sector: "Kerala, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00022", name: "Alfred Murray", sector: "Haryana, India", status: "Connected", mode: "Off", alerts: "A2" },
    { id: "00023", name: "Maggie Sullivan", sector: "Patna, India", status: "Connected", mode: "ON", alerts: "A2" },
    { id: "00024", name: "Rosie Todd", sector: "Manipal, India", status: "Connected", mode: "ON", alerts: "A2" },
  ];

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = devices.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedDevices = devices.slice(startIndex, startIndex + rowsPerPage);

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
    <div className="device-dashboard">
      <h2 className="dashboard-title">Devices</h2>
      <div className="dashboard-controls">
        <input type="text" placeholder="Search" className="search-bar" />
        <button className="filter-button">
        <span role="img" aria-label="settings">
        🔧
        </span>
        </button>
</div>


      <table className="device-table">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Device Name</th>
            <th>Sector</th>
            <th>Status</th>
            <th>Mode</th>
            <th>Alerts</th>
            <th>More</th>
          </tr>
        </thead>
        <tbody>
          {displayedDevices.map((device) => (
            <tr key={device.id} onClick={() => handleRowClick(device.id)} style={{ cursor: "pointer" }}>
              <td>{device.id}</td>
              <td>{device.name}</td>
              <td>{device.sector}</td>
              <td>{device.status}</td>
              <td>{device.mode}</td>
              <td>{device.alerts}</td>
              <td>
                <button className="more-button">↗</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span>
          Showing {startIndex + 1} - {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}
        </span>
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            ◀
          </button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceDashboard;
