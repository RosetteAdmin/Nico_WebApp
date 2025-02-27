import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorsCompanyS.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const vendorsData = [
  { id: "00001", name: "Christine Brooks", sector: "Karnataka, India", access: true },
  { id: "00002", name: "Rosie Pearson", sector: "Karnataka, India", access: true },
  { id: "00003", name: "Darrell Caldwell", sector: "Pune, India", access: false },
  { id: "00004", name: "Gilbert Johnston", sector: "New Delhi, India", access: true },
  { id: "00005", name: "Alan Cain", sector: "Kerala, India", access: true },
  { id: "00006", name: "Alfred Murray", sector: "Haryana, India", access: false },
  { id: "00007", name: "Maggie Sullivan", sector: "Patna, India", access: true },
  { id: "00008", name: "Rosie Todd", sector: "Manipal, India", access: false },
];

const VendorsCompany = () => {
  const [vendors, setVendors] = useState(vendorsData);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleAccess = (id, event) => {
    event.stopPropagation(); // Prevents row click event from firing
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === id ? { ...vendor, access: !vendor.access } : vendor
      )
    );
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`/userinfovendor/${id}`);
  };

  return (
    <div className="div-ven-com-container">
      <div className="div-ven-com-search-bar">
        <h1 className="h1-ven-com-header">Registered Vendor Details</h1>
        <div className="search-bar-container">
          <input
            type="text"
            className="input-ven-com-search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="vendor-search-icon">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
        <button className="filter-button">
          <FontAwesomeIcon icon={faSliders} />
        </button>
        <button className="grant-access-btn" onClick={() => navigate("/addvendorsinfo")}> {/* Added button to add Vendors */}
          Add Vendors
        </button>
      </div>
      <table className="table-ven-com-list">
        <thead className="thead-ven-com">
          <tr className="tr-ven-com-header">
            <th className="th-ven-com">Vendor ID</th>
            <th className="th-ven-com">Vendor Name</th>
            <th className="th-ven-com">Sector</th>
            <th className="th-ven-com">Access</th>
            <th className="th-ven-com">More</th>
          </tr>
        </thead>
        <tbody className="tbody-ven-com">
          {filteredVendors.map((vendor) => (
            <tr 
              key={vendor.id} 
              className="tr-ven-com-item"
              onClick={() => handleRowClick(vendor.id)}
              style={{ cursor: "pointer" }} // Makes the row clickable
            >
              <td className="td-ven-com">{vendor.id}</td>
              <td className="td-ven-com">{vendor.name}</td>
              <td className="td-ven-com">{vendor.sector}</td>
              <td className="td-ven-com" onClick={(e) => e.stopPropagation()}>
                <label className="label-ven-com-switch">
                  <input
                    type="checkbox"
                    className="input-ven-com-toggle"
                    checked={vendor.access}
                    onChange={(e) => toggleAccess(vendor.id, e)}
                  />
                  <span className="span-ven-com-slider"></span>
                </label>
              </td>
              <td className="td-ven-com" onClick={(e) => e.stopPropagation()}>
                <button className="button-ven-com-more">🔗</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="div-ven-com-pagination">
        <button className="button-ven-com-pagination">&lt;</button>
        <span className="span-ven-com-pagination">Showing 1-9 of 78</span>
        <button className="button-ven-com-pagination">&gt;</button>
      </div>
    </div>
  );
};

export default VendorsCompany;
