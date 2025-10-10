import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorsCompanyS.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faAngleLeft, faAngleRight, faSliders, faEllipsis } from "@fortawesome/free-solid-svg-icons";

const VendorsCompany = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const rowsPerPage = 7;

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside any dropdown-wrapper
      if (!event.target.closest('.dropdown-wrapper')) {
        setActiveMenu(null);
      }
    };

    // Add event listener when any menu is active
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenu]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/vendors`)
      .then((response) => response.json())
      .then((data) => {
        const updatedData = (data.value || []).map(vendor => ({
          ...vendor,
          access: true,
          name: vendor.email ? vendor.email.split('@')[0] : vendor.name,
          sector: vendor.sector || "Karnataka, India"
        }));
        setVendors(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (email) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Vendor?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/data/deleteVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setVendors((prevVendors) => prevVendors.filter((vendor) => vendor.email !== email));
        setActiveMenu(null);
        console.log("Vendor deleted successfully");
        alert("Vendor deleted successfully");
      } else {
        console.error("Failed to delete Vendor:", result.message);
        alert("Failed to delete Vendor: " + result.message);
      }
    } catch (error) {
      console.error("Failed to delete Vendor:", error);
      alert("Error occurred while deleting Vendor");
    }
  };

  const toggleAccess = (email, event) => {
    event.stopPropagation();
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.email === email ? { ...vendor, access: !vendor.access } : vendor
      )
    );
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vendor.email && vendor.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalRows = filteredVendors.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedVendors = filteredVendors.slice(startIndex, startIndex + rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRowClick = (email) => {
    navigate(`/userinfovendor/${email}`);
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
        <h2 className="h1-reg-com-title">Local Admin Details</h2>
        <div className="reg-com-actions">
          <div className="associate-reg-com-search-bar-container">
            <input
              type="text"
              placeholder="Search"
              className="reg-search-bar"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="reg-search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
          <button className="filter-button">
            <FontAwesomeIcon icon={faSliders} />
          </button>
          <button
            className="add-user-btn"
            onClick={() => navigate("/addvendorsinfo")}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Local Admin
          </button>
        </div>
        <div className="cus-table-footer">
          <span className="cus-pagination-info">
            {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}
          </span>
          <div className="cus-pagination-controls">
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

      <div className="device-dashboard">
        <table className="device-table">
          <thead>
            <tr>
              {/* <th>Local Admin ID</th> */}
              <th>Local Admin Name</th>
              <th>Local Admin Email</th>
              <th>Sector</th>
              {/* <th>Access</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedVendors.length > 0 ? (
              displayedVendors.map((vendor) => (
                <tr
                  key={vendor.email}
                  onClick={() => handleRowClick(vendor.email)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>
                  {/* <td>{vendor.id}</td> */}
                  <td>{vendor.sector}</td>
                  {/* <td onClick={(e) => e.stopPropagation()}>
                    <label className="label-reg-com-switch">
                      <input
                        type="checkbox"
                        className="input-reg-com-toggle"
                        checked={vendor.access}
                        onChange={(e) => toggleAccess(vendor.email, e)}
                      />
                      <span className="span-reg-com-slider"></span>
                    </label>
                  </td> */}
                  <td>
                    <div className="dropdown-wrapper">
                      <FontAwesomeIcon
                        className="ellipsis-icon"
                        icon={faEllipsis}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu((prev) =>
                            prev === vendor.email ? null : vendor.email
                          );
                        }}
                      />
                      {activeMenu === vendor.email && (
                        <div className="dropdown-menu">
                          {/* <div
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/addvendorsinfo");
                              setActiveMenu(null);
                            }}
                          >
                            Edit User
                          </div> */}
                          <div
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(vendor.email);
                            }}
                          >
                            Delete User
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VendorsCompany;
