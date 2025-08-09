// // index.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./RegisteredCompanyS.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";

// const associatesData = [
//   // { id: "00001", name: "Christine Brooks", sector: "Karnataka, India", access: true },
//   // { id: "00002", name: "Rosie Pearson", sector: "Karnataka, India", access: true },
//   // { id: "00003", name: "Darrell Caldwell", sector: "Pune, India", access: false },
//   // { id: "00004", name: "Gilbert Johnston", sector: "New Delhi, India", access: true },
//   // { id: "00005", name: "Alan Cain", sector: "Kerala, India", access: true },
//   // { id: "00006", name: "Alfred Murray", sector: "Haryana, India", access: false },
//   // { id: "00007", name: "Maggie Sullivan", sector: "Patna, India", access: true },
//   // { id: "00008", name: "Rosie Todd", sector: "Manipal, India", access: false },
//   { id: "ca1", name: "company associate 1", sector: "Karnataka, India", access: true },
//   { id: "ca2", name: "company associate 2", sector: "Karnataka, India", access: true },
//   { id: "ca3", name: "company associate 3", sector: "Karnataka, India", access: true },


// ];

// const RegisteredCompany = () => {
//   const [associates, setAssociates] = useState(associatesData);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   const toggleAccess = (id, event) => {
//     event.stopPropagation(); // Prevents row click event from firing when toggling access
//     setAssociates((prev) =>
//       prev.map((associate) =>
//         associate.id === id ? { ...associate, access: !associate.access } : associate
//       )
//     );
//   };

//   const filteredAssociates = associates.filter((associate) =>
//     associate.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleRowClick = (id) => {
//     navigate(`/userinfo/${id}`);
//   };

//   return (
//     <div className="div-reg-com-container">
//       <div className="div-reg-com-header">
//         <h1 className="h1-reg-com-title">Registered Company Associate Details</h1>
//         <div className="reg-com-actions">
//           <div className="associate-reg-com-search-bar-container">
//             <input
//               type="text"
//               className="input-reg-com-search"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <span className="associate-reg-com-search-icon">
//               <FontAwesomeIcon icon={faSearch} />
//             </span>
//           </div>
//           <button className="associate-reg-com-filter-button">
//             <FontAwesomeIcon icon={faSliders} />
//           </button>
//           <button className="grant-access-btn" onClick={() => navigate("/addusersinfo")}> {/* Added button to add Users */}
//             Add User
//           </button>
//         </div>
//       </div>

//       <table className="table-reg-com-list">
//         <thead className="thead-reg-com">
//           <tr className="tr-reg-com-header">
//             <th className="th-reg-com">Associate ID</th>
//             <th className="th-reg-com">Associate Name</th>
//             <th className="th-reg-com">Sector</th>
//             <th className="th-reg-com">Access</th>
//             <th className="th-reg-com">More</th>
//           </tr>
//         </thead>
//         <tbody className="tbody-reg-com">
//           {filteredAssociates.map((associate) => (
//             <tr
//               key={associate.id}
//               className="tr-reg-com-item"
//               onClick={() => handleRowClick(associate.id)}
//               style={{ cursor: "pointer" }} // Makes it clear that the row is clickable
//             >
//               <td className="td-reg-com">{associate.id}</td>
//               <td className="td-reg-com">{associate.name}</td>
//               <td className="td-reg-com">{associate.sector}</td>
//               <td className="td-reg-com" onClick={(e) => e.stopPropagation()}> {/* Prevents navigation when toggling */}
//                 <label className="label-reg-com-switch">
//                   <input
//                     type="checkbox"
//                     className="input-reg-com-toggle"
//                     checked={associate.access}
//                     onChange={(e) => toggleAccess(associate.id, e)}
//                   />
//                   <span className="span-reg-com-slider"></span>
//                 </label>
//               </td>
//               <td className="td-reg-com" onClick={(e) => e.stopPropagation()}> {/* Prevents navigation when clicking button */}
//                 <button className="button-reg-com-more">🔗</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="div-reg-com-pagination">
//         <span className="span-reg-com-pagination">Showing 1-9 of 78</span>
//         <div className="pagination-buttons">
//         <button className="button-reg-com-pagination">&lt;</button>
//         <button className="button-reg-com-pagination">&gt;</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisteredCompany;
import React, { useState, useEffect } from "react";
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

  const rowsPerPage = 7;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/companyassociates`)
      .then((response) => response.json())
      .then((data) => {
        const updatedData = (data.value || []).map(associate => ({
          ...associate,
          access: true, // Default access to true
          name: associate.email.split('@')[0], // Extract name from email
          sector: "Karnataka, India" // Default sector 
        }));
        setAssociates(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching company associates:", error);
        setLoading(false);
      });
  }, []);

  const toggleAccess = (id, event) => {
    event.stopPropagation();
    setAssociates((prev) =>
      prev.map((associate) =>
        associate.id === id ? { ...associate, access: !associate.access } : associate
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

  const handleRowClick = (id) => {
    navigate(`/userinfo/${id}`);
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
            <FontAwesomeIcon icon={faPlus} /> Add User
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
              <th>Associate ID</th>
              <th>Associate Name</th>
              <th>Sector</th>
              <th>Access</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedAssociates.length > 0 ? (
              displayedAssociates.map((associate) => (
                <tr
                  key={associate.id}
                  onClick={() => handleRowClick(associate.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{associate.id}</td>
                  <td>{associate.name}</td>
                  <td>{associate.sector}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <label className="label-reg-com-switch">
                      <input
                        type="checkbox"
                        className="input-reg-com-toggle"
                        checked={associate.access}
                        onChange={(e) => toggleAccess(associate.id, e)}
                      />
                      <span className="span-reg-com-slider"></span>
                    </label>
                  </td>
                  <td>
                    <div className="dropdown-wrapper">
                      <FontAwesomeIcon
                        className="ellipsis-icon"
                        icon={faEllipsis}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu((prev) =>
                            prev === associate.id ? null : associate.id
                          );
                        }}
                      />
                      {activeMenu === associate.id && (
                        <div className="dropdown-menu">
                          <div
                            className="dropdown-items"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/addusersinfo");
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} /> Add New
                          </div>
                          <div
                            className="dropdown-items"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(associate.id);
                            }}
                          >
                            View Details
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
