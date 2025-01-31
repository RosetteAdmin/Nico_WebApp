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
    <div className="div-reg-com-container">
      <div className="div-reg-com-search-bar">
        <h1 className="h1-reg-com-header">Registered Vendor Details</h1>
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
      </div>
      <table className="table-reg-com-list">
        <thead className="thead-reg-com">
          <tr className="tr-reg-com-header">
            <th className="th-reg-com">Vendor ID</th>
            <th className="th-reg-com">Vendor Name</th>
            <th className="th-reg-com">Sector</th>
            <th className="th-reg-com">Access</th>
            <th className="th-reg-com">More</th>
          </tr>
        </thead>
        <tbody className="tbody-reg-com">
          {filteredVendors.map((vendor) => (
            <tr 
              key={vendor.id} 
              className="tr-reg-com-item"
              onClick={() => handleRowClick(vendor.id)}
              style={{ cursor: "pointer" }} // Makes the row clickable
            >
              <td className="td-reg-com">{vendor.id}</td>
              <td className="td-reg-com">{vendor.name}</td>
              <td className="td-reg-com">{vendor.sector}</td>
              <td className="td-reg-com" onClick={(e) => e.stopPropagation()}>
                <label className="label-reg-com-switch">
                  <input
                    type="checkbox"
                    className="input-reg-com-toggle"
                    checked={vendor.access}
                    onChange={(e) => toggleAccess(vendor.id, e)}
                  />
                  <span className="span-reg-com-slider"></span>
                </label>
              </td>
              <td className="td-reg-com" onClick={(e) => e.stopPropagation()}>
                <button className="button-ven-com-more">🔗</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="div-reg-com-pagination">
        <button className="button-reg-com-pagination">&lt;</button>
        <span className="span-reg-com-pagination">Showing 1-9 of 78</span>
        <button className="button-reg-com-pagination">&gt;</button>
      </div>
    </div>
  );
};

export default VendorsCompany;
