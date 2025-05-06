import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch,faSliders,faEllipsisVertical,} from "@fortawesome/free-solid-svg-icons";
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading screen
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/customers`)
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data.value || []); // Safe access
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Filter customers based on the search query
  const filteredCustomers = customers.filter((Customer) =>
    Object.values(Customer)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalRows = filteredCustomers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleEdit = (email) => {
    navigate(`/edit/${email}`);  
  };
  

  const handleDelete = async (email) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/data/deletecustomer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),  // <-- Send email in body
      });
  
      const result = await response.json();
  
      if (result.status === 'success') {
        // Remove the customer from state
        setCustomers(prevCustomers => prevCustomers.filter(c => c.email !== email));
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user:', result.message);
      }
  
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };
  
  

  const handleRowClick = () => {
    // navigate(`/device/${id}`);
  };

  return (
    <>
      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner"></div>
          <div className="loading-text">Waiting for server...</div>
        </div>
      )}
      <div className="device-dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="dashboard-title" style={{ margin: 0 }}>
            Device Owners
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search by Email, Name, Sector, or Devices"
                className="search-bar"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
              />
              <span className="dev-search-icon">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
            <button className="filter-button">
              <FontAwesomeIcon icon={faSliders} />
            </button>
          </div>
        </div>

        <table className="device-table">
          <thead>
            <tr>
              <th>Email ID</th>
              <th>Name</th>
              <th>Sector</th>
              <th>Devices Linked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedCustomers.length > 0 ? (
              displayedCustomers.map((Customer) => (
                <tr
                  key={Customer.email}
                  onClick={() => handleRowClick(Customer.email)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{Customer.email}</td>
                  <td>{Customer.name}</td>
                  <td>{Customer.sector}</td>
                  <td>{Customer.connected_devices}</td>
                  <td>
                    <div className="dropdown-wrapper">
                      <FontAwesomeIcon
                        className="ellipsis-icon"
                        icon={faEllipsisVertical}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu((prev) =>
                            prev === Customer.email ? null : Customer.email
                          );
                        }}
                      />
                      {activeMenu === Customer.email && (
                        <div className="dropdown-menu">
                          {/* editing a customer */}
                          <div className="dropdown-item" onClick={(e) => {
                            e.stopPropagation();   // prevent table row click
                            handleEdit(Customer.email); // pass the email
                          }}>
                            Edit User
                          </div>


                          {/* deleting customer */}
                          <div className="dropdown-item" onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(Customer.email);
                          }}>
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
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span>
            Showing {startIndex + 1} -{" "}
            {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}
          </span>
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              ◀
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
