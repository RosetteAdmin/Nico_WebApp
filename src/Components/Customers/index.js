import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch,faAngleLeft,faAngleRight, faSliders,faPlus, faEllipsis } from "@fortawesome/free-solid-svg-icons";
// The CSS import has been updated to the new file name
import "./Customers.css"; 

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const getRowsPerPage = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1600) {
      return 11;
    } else if (screenWidth >= 1400) {
      return 9;
    } else if (screenWidth >= 1200) {
      return 8;
    } else {
      return 7;
    }
  };


  // At top of component, add:
const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
})();
const userRole  = storedUser?.role !== undefined ? Number(storedUser.role) : null;
const userEmail = storedUser?.email || "";

// Replace existing fetch useEffect (remove the getRandomStatus part):
useEffect(() => {
  const url = `${process.env.REACT_APP_EP}/data/customers?caller_email=${encodeURIComponent(userEmail)}&caller_role=${userRole}`;
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      setCustomers(data.value || []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [userEmail, userRole]);


  useEffect(() => {
    const updateRowsPerPage = () => {
      setRowsPerPage(getRowsPerPage());
    };

    updateRowsPerPage();
    window.addEventListener('resize', updateRowsPerPage);

    return () => window.removeEventListener('resize', updateRowsPerPage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-wrapper')) {
        setActiveMenu(null);
      }
    };
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenu]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, searchQuery]);

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

   const handleRowClick = (email) => {
    navigate(`/userinfooperator/${email}`);
  };

  return (
    <>
      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner"></div>
          <div className="loading-text">Waiting for server...</div>
        </div>
      )}
      <div className="operator-header-card">
        <h2 className="operator-title">Operators</h2>
        
        <div className="operator-search-filter-bar">
            <input
              type="text"
              placeholder="Search"
              className="operator-search-bar"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="operator-search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </span>
        </div>

        <button className="operator-filter-btn">
          <FontAwesomeIcon icon={faSliders} />
        </button>

        <button
          className="operator-add-btn"
          onClick={() => navigate("/addoperatorinfo")}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Operator
        </button>

        <div className="operator-table-footer">
          <span className="operator-pagination-info">
            {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}
          </span>
          <div className="operator-pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              <span className="operator-arrow-icon">
                <FontAwesomeIcon icon={faAngleLeft} />
              </span>
            </button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              <span className="operator-arrow-icon">
                <FontAwesomeIcon icon={faAngleRight} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="operator-table-container">
        <table>
          <thead>
            <tr>
              <th className="operator-th">Name</th>
              <th className="operator-th">Email</th>
              <th className="operator-th">Location/Sector</th>
              <th className="operator-th">Devices Linked</th>
              <th className="operator-th">Action</th>
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
                  <td className="operator-td">{customer.name}</td>
                  <td className="operator-td">{customer.email}</td>
                  <td className="operator-td">{customer.sector}</td>
                  <td className="operator-td">{customer.connected_devices}</td>
                  <td className="operator-td">
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
                            }}
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
                <td className="operator-td" colSpan="5" style={{ textAlign: "center" }}>
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