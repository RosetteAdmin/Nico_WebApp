import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisteredCompanyS.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faAngleLeft, faAngleRight, faSliders, faEllipsis } from "@fortawesome/free-solid-svg-icons";

const RegisteredCompany = () => {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  // Create refs for each dropdown menu
  const dropdownRefs = useRef({});

  const rowsPerPage = 8;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside all dropdowns
      let clickedInsideAnyDropdown = false;
      
      Object.values(dropdownRefs.current).forEach(ref => {  
        if (ref && ref.contains(event.target)) {
          clickedInsideAnyDropdown = true;
        }
      });

      // If clicked outside all dropdowns, close the active menu
      if (!clickedInsideAnyDropdown && activeMenu) {
        setActiveMenu(null);
      }
    };

    // Use mousedown instead of click for better responsiveness
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/companyassociates`)
      .then((response) => response.json())
      .then((data) => {
        const updatedData = (data.value || []).map(associate => ({
          ...associate,
          access: true,
          
        }));
        setAssociates(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching company associates:", error);
        setLoading(false);
      });
  }, []);

  
  const handleDelete = async (email) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Company Associate?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/data/deleteCompanyAssociate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setAssociates((prevAssociates) => prevAssociates.filter((associate) => associate.email !== email));
        setActiveMenu(null);
        console.log("Company Associate deleted successfully");
        alert("Company Associate deleted successfully");
      } else {
        console.error("Failed to delete Company Associate:", result.message);
        alert("Failed to delete Company Associate: " + result.message);
      }
    } catch (error) {
      console.error("Failed to delete Company Associate:", error);
      alert("Error occurred while deleting Company Associate");
    }
  };

  const toggleAccess = (email, event) => {
    event.stopPropagation();
    setAssociates((prev) =>
      prev.map((associate) =>
        associate.email === email ? { ...associate, access: !associate.access } : associate
      )
    );
  };

  const filteredAssociates = associates.filter((associate) =>
    associate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    associate.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRows = filteredAssociates.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayedAssociates = filteredAssociates.slice(startIndex, startIndex + rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRowClick = (email) => {
    navigate(`/userinfo/${email}`);
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
        <h2 className="h1-reg-com-title ">Associate Details</h2>
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
            onClick={() => navigate("/addusersinfo")}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Associate
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
              {/* <th>Associate ID</th> */}
              <th>Associate Name</th>
              <th>Associate Email</th>
              <th>Sector</th>
              {/* <th>Access</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedAssociates.length > 0 ? (
              displayedAssociates.map((associate) => (
                <tr
                  key={associate.email}
                  onClick={() => handleRowClick(associate.email)}
                  style={{ cursor: "pointer" }}
                >
                  {/* <td>{associate.id}</td> */}
                  <td>{associate.name}</td>
                  <td>{associate.email}</td>
                  <td>{associate.sector}</td>
                  {/* <td onClick={(e) => e.stopPropagation()}>
                    <label className="label-reg-com-switch">
                      <input
                        type="checkbox"
                        className="input-reg-com-toggle"
                        checked={associate.access}
                        onChange={(e) => toggleAccess(associate.email, e)}
                      />
                      <span className="span-reg-com-slider"></span>
                    </label>
                  </td> */}
                  <td>
                    <div 
                      className="dropdown-wrapper"
                      ref={(el) => dropdownRefs.current[associate.email] = el}
                    >
                      <FontAwesomeIcon
                        className="ellipsis-icon"
                        icon={faEllipsis}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu((prev) =>
                            prev === associate.email ? null : associate.email
                          );
                        }}
                      />
                      {activeMenu === associate.email && (
                        <div className="dropdown-menu">
                          {/* <div
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/addusersinfo");
                              setActiveMenu(null);
                            }}
                          >
                            Edit User
                          </div> */}
                          <div
                            className="dropdown-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(associate.email);
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
                  No associates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RegisteredCompany;
