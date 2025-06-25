import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEllipsis,faAngleLeft,faPlus, faAngleRight, faSliders } from "@fortawesome/free-solid-svg-icons";
import "./PreRegDevices.css";

const ITEMS_PER_PAGE = 8;

const VendorsCompany = () => {
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const rowsPerPage = 10;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/getprdevices`)
      .then(response => response.json())
      .then(data => {
        setVendorsData(data.data);
        setLoading(false); // Set loading to false after devices are set
      })      
      .catch(error => {
        console.error('Error fetching devices:', error);
        setLoading(false); // Set loading to false in case of error
      });  
    }, []);

  // Apply search filter
  const filteredVendors = vendorsData.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply pagination
  const totalRows = filteredVendors.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedDevices = filteredVendors.slice(startIndex, startIndex + rowsPerPage);

  const handleEditClick = (id, e) => {
    e.stopPropagation(); // Prevent unintended row click behavior
    navigate(`/editvendor/${id}`);
  };

  const handleDeployClick = (id, e) => {
    e.stopPropagation(); // Prevent unintended row click behavior
    alert(`Deploying vendor with ID: ${id}`);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
   
  const handleAdd= () => {
    window.location.href = "/add-device"; // Force full reload to reset state
  };
      

  return (
    <div className="reg-dev-container">
      {loading && (
        <div className="reg-dev-loading-backdrop">
          <div className="reg-dev-loading-spinner"></div>
          <div className="reg-dev-loading-text">Waiting for server...</div>
        </div>
      )}
      <div className="reg-dev-header-card">
        <h2 className="reg-dev-title">Registered Devices</h2>
        <button className="reg-dev-add-btn" onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} /> Add New
        </button>
        <div className="reg-dev-search-filter-bar">

        <input
          type="text"
          placeholder="Search"
          className="reg-dev-search-bar"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <span className="preg-dev-search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <button className="reg-dev-filter-btn">
          <FontAwesomeIcon icon={faSliders} />
        </button>
        </div>
        <div className="reg-dev-table-footer">
          <span className="reg-dev-pagination-info">
            {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}
          </span>
          <div className="reg-dev-pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              <span className="reg-dev-arrow-icon">
                <FontAwesomeIcon icon={faAngleLeft} />
              </span>
            </button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              <span className="reg-dev-arrow-icon">
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="reg-dev-table-container">
        <table className="table-reg-com-list">
          <thead className="thead-reg-com">
            <tr className="tr-reg-com-header">
              <th className="th-reg-com">Device ID</th>
              <th className="th-reg-com">Device Name</th>
              <th className="th-reg-com">Sector</th>
              <th className="th-reg-com">Device Owner</th>
              <th className="th-reg-com">Status</th>
              <th className="th-reg-com">Actions</th>
            </tr>
          </thead>
          <tbody className="tbody-reg-com">
            {displayedDevices.map((vendor) => (
              <tr key={vendor.id} className="tr-reg-com-item">
                <td className="td-reg-com">{vendor.id}</td>
                <td className="td-reg-com">{vendor.name}</td>
                <td className="td-reg-com">{vendor.sector}</td>
                <td className="td-reg-com">{vendor.owner}</td>
                <td className="td-reg-com"></td>
                <td
                  className="td-reg-com"
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <FontAwesomeIcon
                                          className="ellipsis-icon"
                                          icon={faEllipsis}
                                          
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorsCompany;