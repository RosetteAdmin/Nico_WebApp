import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch,faAngleLeft,faAngleRight, faSliders, faEllipsisVertical,faEllipsis } from "@fortawesome/free-solid-svg-icons";
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/customers`)
      .then((response) => response.json())
      .then((data) => {
        const updatedData = (data.value || []).map(customer => ({
          ...customer,
          status: getRandomStatus()
        }));
        setCustomers(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        setLoading(false);
      });
  }, []);

  const getRandomStatus = () => {
    const statuses = ["Info", "Warning", "Dark", "Light", "Secondary", "Success", "Danger"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalRows = filteredCustomers.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage);

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setCustomers((prevCustomers) => prevCustomers.filter((c) => c.email !== email));
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user:", result.message);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
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
<div className="search-bar-container">
      <h2 className="dashboard-title">Customers</h2>
      
            
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


      <div className="device-dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          
        </div>

        <table className="device-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Location/Sector</th>
              <th>Devices Linked</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedCustomers.length > 0 ? (
              displayedCustomers.map((customer) => (
                <tr
                  key={customer.email}
                  onClick={() => handleRowClick(customer.email)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{customer.email}</td>
                  <td>{customer.name}</td>
                  <td>{customer.sector}</td>
                  <td>{customer.connected_devices}</td>
                  <td>
                    <span className={`status-indicator status-${customer.status.toLowerCase()}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown-wrapper">
                      <FontAwesomeIcon
                        className="ellipsis-icon"
                        icon={faEllipsis}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu((prev) =>
                            prev === customer.email ? null : customer.email
                          );
                        }}
                      />
                      {activeMenu === customer.email && (
                        <div className="dropdown-menu">
                          <div
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(customer.email);
                            }
                          }
                          >
                            Edit User
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(customer.email);
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
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        
      </div>
    </>
  );
};

export default Customers;