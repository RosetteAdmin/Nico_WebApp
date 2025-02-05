import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import "./PreRegDevices.css";

const ITEMS_PER_PAGE = 8;

const VendorsCompany = () => {
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

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

  // Calculate total pages      
  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);

  // Apply pagination
  const currentVendors = filteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEditClick = (id, e) => {
    e.stopPropagation(); // Prevent unintended row click behavior
    navigate(`/editvendor/${id}`);
  };

  const handleDeployClick = (id, e) => {
    e.stopPropagation(); // Prevent unintended row click behavior
    alert(`Deploying vendor with ID: ${id}`);
  };

  return (
    <div className="div-reg-com-container">
      {loading && (
      <div className="loading-backdrop">
        <div className="loading-spinner"></div>
        <div className="loading-text">Waiting for server...</div>
      </div>
      )}
      <div className="div-reg-com-search-bar">
        <h1 className="h1-reg-com-header">Pre - Registered Devices</h1>
        <div className="search-bar-container">
          <input
            type="text"
            className="input-ven-com-search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
          <span className="vendor-search-icon">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
        <button className="filter-button">
          <FontAwesomeIcon icon={faSliders} />
        </button>
      </div>

      <table className="table-reg-com-list">
        <thead className="thead-reg-com">
          <tr className="tr-reg-com-header">
            <th className="th-reg-com">Device ID</th>
            <th className="th-reg-com">Device Name</th>
            <th className="th-reg-com">Device Owner</th>
            <th className="th-reg-com">Sector</th>
            <th className="th-reg-com">Actions</th>
          </tr>
        </thead>
        <tbody className="tbody-reg-com">
          {currentVendors.map((vendor) => (
            <tr key={vendor.id} className="tr-reg-com-item">
              <td className="td-reg-com">{vendor.id}</td>
              <td className="td-reg-com">{vendor.name}</td>
              <td className="td-reg-com">{vendor.owner}</td>
              <td className="td-reg-com">{vendor.sector}</td>
              <td
                className="td-reg-com"
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <button className="edit-button" onClick={(e) => handleEditClick(vendor.id, e)}>
                  <span className="edit-icon">✏️</span> Edit
                </button>
                <button className="deploy-button" onClick={(e) => handleDeployClick(vendor.id, e)}>
                  <span className="deploy-icon">🚀</span> Deploy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="div-reg-com-pagination">
        <button
          className="button-reg-com-pagination"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span className="span-reg-com-pagination">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="button-reg-com-pagination"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default VendorsCompany;
