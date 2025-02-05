import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import "./PreRegDevices.css";

const vendorsData = [
  { id: "00001", name: "Christine Brooks", owner: "MIT, Manipal", sector: "Karnataka" },
  { id: "00002", name: "Rosie Pearson", owner: "Fishery Dept", sector: "Kerala" },
  { id: "00003", name: "Darrell Caldwell", owner: "XYZAB", sector: "Maharashtra" },
  { id: "00004", name: "Gilbert Johnston", owner: "Delhi Zoo", sector: "Delhi" },
  { id: "00005", name: "Alan Cain", owner: "ABC Corp", sector: "Gujarat" },
  { id: "00006", name: "Alfred Murray", owner: "Tech Solutions", sector: "Tamil Nadu" },
  { id: "00007", name: "Maggie Sullivan", owner: "Agro India", sector: "Rajasthan" },
  { id: "00008", name: "Rosie Todd", owner: "Green Energy", sector: "West Bengal" },
  { id: "00009", name: "Christine Brooks", owner: "MIT, Manipal", sector: "Karnataka" },
  { id: "00010", name: "Rosie Pearson", owner: "Fishery Dept", sector: "Kerala" },
  { id: "00011", name: "Darrell Caldwell", owner: "XYZAB", sector: "Maharashtra" },
  { id: "00012", name: "Gilbert Johnston", owner: "Delhi Zoo", sector: "Delhi" },
  { id: "00013", name: "Alan Cain", owner: "ABC Corp", sector: "Gujarat" },
  { id: "00014", name: "Alfred Murray", owner: "Tech Solutions", sector: "Tamil Nadu" },
  { id: "00015", name: "Maggie Sullivan", owner: "Agro India", sector: "Rajasthan" },
  { id: "00016", name: "Rosie Todd", owner: "Green Energy", sector: "West Bengal" },
  { id: "00017", name: "Christine Brooks", owner: "MIT, Manipal", sector: "Karnataka" },
  { id: "00018", name: "Rosie Pearson", owner: "Fishery Dept", sector: "Kerala" },
  { id: "00019", name: "Darrell Caldwell", owner: "XYZAB", sector: "Maharashtra" },
  { id: "00020", name: "Gilbert Johnston", owner: "Delhi Zoo", sector: "Delhi" },
];

const ITEMS_PER_PAGE = 8;

const VendorsCompany = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

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
    console.log(`Deploying vendor with ID: ${id}`);
  };

  return (
    <div className="div-reg-com-container">
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
