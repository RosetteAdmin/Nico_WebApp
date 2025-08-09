import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders ,faEllipsis,faAngleLeft,faAngleRight,faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import "./DeviceDashboard.css";

const DeviceDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading screen
  const userrole = JSON.parse(localStorage.getItem("user")).role;

  useEffect(() => {
    //old route to directly fetch devices
    fetch(`${process.env.REACT_APP_EP}/api/devices`)   
    // fetch(`${process.env.REACT_APP_EP}/api/devices/active`)
      .then(response => response.json())
      .then(data => {
        const updatedData = (data.value || []).map(device => ({
          ...device,
          status: getRandomStatus()
        }));
        setDevices(updatedData);
        setLoading(false); // Set loading to false after devices are set
      })      
      .catch(error => {
        console.error('Error fetching devices:', error);
        setLoading(false); // Set loading to false in case of error
      });  
    }, []);

    
    const getRandomStatus = () => {
    const statuses = ["Info", "Warning", "Dark", "Light", "Secondary", "Success", "Danger"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };
  // const devices = [
  //   { id: "00001", name: "Christine Brooks", sector: "Karnataka, India", status: "Not Connected", mode: "-", alerts: "A1" },
  //   { id: "00002", name: "Rosie Pearson", sector: "Karnataka, India", status: "Connected", mode: "ON", alerts: "A2" },
  //   { id: "00003", name: "Darrell Caldwell", sector: "Pune, India", status: "Not Connected", mode: "ON", alerts: "A2" },
  //   { id: "00004", name: "Gilbert Johnston", sector: "New Delhi, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00005", name: "Alan Cain", sector: "Kerala, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00006", name: "Alfred Murray", sector: "Haryana, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00007", name: "Maggie Sullivan", sector: "Patna, India", status: "Connected", mode: "ON", alerts: "A2" },
  //   { id: "00008", name: "Rosie Todd", sector: "Manipal, India", status: "Connected", mode: "ON", alerts: "A2" },
  //   { id: "00009", name: "Christine Brooks", sector: "Karnataka, India", status: "Not Connected", mode: "-", alerts: "A1" },
  //   { id: "00010", name: "Rosie Pearson", sector: "Karnataka, India", status: "Connected", mode: "ON", alerts: "A2" },
  //   { id: "00011", name: "Darrell Caldwell", sector: "Pune, India", status: "Not Connected", mode: "ON", alerts: "A2" },
  //   { id: "00012", name: "Gilbert Johnston", sector: "New Delhi, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00013", name: "Alan Cain", sector: "Kerala, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00014", name: "Alfred Murray", sector: "Haryana, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00015", name: "Maggie Sullivan", sector: "Patna, India", status: "Connected", mode: "ON", alerts: "A2" },
  //   { id: "00016", name: "Rosie Todd", sector: "Manipal, India", status: "Connected", mode: "ON", alerts: "A2" },
  //   { id: "00017", name: "Christine Brooks", sector: "Karnataka, India", status: "Not Connected", mode: "-", alerts: "A1" },
  //   { id: "00018", name: "Rosie Pearson", sector: "Karnataka, India", status: "Connected", mode: "ON", alerts: "A2" },
  //   { id: "00019", name: "Darrell Caldwell", sector: "Pune, India", status: "Not Connected", mode: "ON", alerts: "A2" },
  //   { id: "00020", name: "Gilbert Johnston", sector: "New Delhi, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00021", name: "Alan Cain", sector: "Kerala, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00022", name: "Alfred Murray", sector: "Haryana, India", status: "Connected", mode: "Off", alerts: "A2" },
  //   { id: "00023", name: "Maggie Sullivan", sector: "Patna, India", status: "Connected", mode: "ON", alerts: "A2" },
  //   { id: "00024", name: "Rosie Todd", sector: "Manipal, India", status: "Connected", mode: "ON", alerts: "A2" },
  // ];

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
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
      
                  <div className="table-footer">
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
            {/* <th>More</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedDevices.length > 0 ? (
            displayedDevices.map((device) => (
              <tr key={device.id} onClick={() => handleRowClick(device.id)} style={{ cursor: "pointer" }}>
                <td>{device.id}</td>
                <td>{device.displayName}</td>
                <td>{device.sector}</td>
                {/* <td>{device.status}</td> */}
                {/* <td>{device.mode}</td> */}
                <td>{device.owner_name}</td>
                <td>
  <span className={`status-indicator status-${(device.status).toLowerCase()}`}>
    {device.status}
  </span>
</td>
                <td>
                 <div className="dropdown-wrapper">
                                       <FontAwesomeIcon
                                         className="ellipsis-icon"
                                         icon={faEllipsis}
                                       />
                                     </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
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