// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./userinfo.css"; // Use the same CSS structure as EditDevice.css

// const Userinfo = () => {
//   const { email } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [associateInfo, setAssociateInfo] = useState({
//     email: "",
//     name: "",
//     phone_number: "",
//     sector: "",
//     role: ""
//   });

//   const [editableInfo, setEditableInfo] = useState({
//     name: "",
//     phone_number: "",
//     sector: ""
//   });

//   useEffect(() => {
//     const fetchAssociateData = async () => {
//       if (!email) {
//         alert("No email provided");
//         setLoading(false);
//         return;
//       }

//       try {
//         const url = `${process.env.REACT_APP_EP}/data/associate/${encodeURIComponent(email)}`;
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const result = await response.json();

//         if (result.status === "success") {
//           setAssociateInfo(result.data);
//           setEditableInfo({
//             name: result.data.name || "",
//             phone_number: result.data.phone_number || "",
//             sector: result.data.sector || ""
//           });
//         } else {
//           alert(`Failed to load associate data: ${result.message}`);
//         }
//       } catch (error) {
//         alert(`Error: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssociateData();
//   }, [email]);

//   const handleInputChange = (field, value) => {
//     setEditableInfo(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSaveChanges = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_EP}/data/updateassociate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: associateInfo.email,
//           name: editableInfo.name,
//           phone_number: editableInfo.phone_number,
//           sector: editableInfo.sector
//         }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const result = await response.json();

//       if (result.status === "success") {
//         alert("Associate updated successfully!");
//         setAssociateInfo(prev => ({
//           ...prev,
//           name: editableInfo.name,
//           phone_number: editableInfo.phone_number,
//           sector: editableInfo.sector
//         }));
//         setIsEditMode(false);
//         setTimeout(() => navigate("/caccess"), 500);
//       } else {
//         alert(`Failed to update associate: ${result.message}`);
//       }
//     } catch (error) {
//       alert(`Failed to update associate: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditToggle = () => {
//     if (isEditMode) handleSaveChanges();
//     else setIsEditMode(true);
//   };

//   if (loading) {
//     return (
//       <div className="loading-backdrop">
//         <div className="loading-spinner"></div>
//         <div className="loading-text">Loading associate data...</div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header section */}
//       <div className="grant-access-headerr">
//         <h1 className="vendor-title">Edit Associate Details</h1>
//         <button
//           className="add-vendor-btn"
//           onClick={handleEditToggle}
//           disabled={loading}
//         >
//           {isEditMode ? (loading ? "Saving..." : "Save Changes") : "Edit"}
//         </button>
//       </div>

//       {/* Main container */}
//       <div className="vendor-management-container">
//         <div className="vendor-content-wrapper">
//           <div className="form-container">
//             <h2>Change Details:</h2>

//             <div className="form-row two-col">
//               <div className="form-group">
//                 <label>Associate Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter name"
//                   value={isEditMode ? editableInfo.name : associateInfo.name}
//                   onChange={(e) => handleInputChange("name", e.target.value)}
//                   disabled={!isEditMode}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Email ID</label>
//                 <input
//                   type="email"
//                   placeholder="email@email.com"
//                   value={associateInfo.email}
//                   readOnly
//                   className="readonly-field"
//                 />
//               </div>
//             </div>

//             <div className="form-row two-col">
//               <div className="form-group">
//                 <label>Phone Number</label>
//                 <input
//                   type="tel"
//                   placeholder="1234567890"
//                   value={isEditMode ? editableInfo.phone_number : associateInfo.phone_number}
//                   onChange={(e) => handleInputChange("phone_number", e.target.value)}
//                   disabled={!isEditMode}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Sector</label>
//                 <input
//                   type="text"
//                   placeholder="Enter sector"
//                   value={isEditMode ? editableInfo.sector : associateInfo.sector}
//                   onChange={(e) => handleInputChange("sector", e.target.value)}
//                   disabled={!isEditMode}
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Role</label>
//                 <input
//                   type="text"
//                   placeholder="Role"
//                   value={associateInfo.role}
//                   readOnly
//                   className="readonly-field"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Userinfo;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// The CSS import has been updated to the new file name
import "./userinfo.css"; 

const Userinfo = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [associateInfo, setAssociateInfo] = useState({
    email: "",
    name: "",
    phone_number: "",
    sector: "",
    role: ""
  });

  const [editableInfo, setEditableInfo] = useState({
    name: "",
    phone_number: "",
    sector: ""
  });

  useEffect(() => {
    const fetchAssociateData = async () => {
      if (!email) {
        alert("No email provided");
        setLoading(false);
        return;
      }

      try {
        const url = `${process.env.REACT_APP_EP}/data/associate/${encodeURIComponent(email)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();

        if (result.status === "success") {
          setAssociateInfo(result.data);
          setEditableInfo({
            name: result.data.name || "",
            phone_number: result.data.phone_number || "",
            sector: result.data.sector || ""
          });
        } else {
          alert(`Failed to load associate data: ${result.message}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociateData();
  }, [email]);

  const handleInputChange = (field, value) => {
    setEditableInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/data/updateassociate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: associateInfo.email,
          name: editableInfo.name,
          phone_number: editableInfo.phone_number,
          sector: editableInfo.sector
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.status === "success") {
        alert("Associate updated successfully!");
        setAssociateInfo(prev => ({
          ...prev,
          name: editableInfo.name,
          phone_number: editableInfo.phone_number,
          sector: editableInfo.sector
        }));
        setIsEditMode(false);
        setTimeout(() => navigate("/caccess"), 500);
      } else {
        alert(`Failed to update associate: ${result.message}`);
      }
    } catch (error) {
      alert(`Failed to update associate: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) handleSaveChanges();
    else setIsEditMode(true);
  };

  if (loading) {
    return (
      <div className="associate-details-loading-backdrop">
        <div className="associate-details-loading-spinner"></div>
        <div className="associate-details-loading-text">Loading associate data...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header section */}
      <div className="associate-details-header">
        <h1 className="associate-details-title">Edit Associate Details</h1>
        <button
          className="associate-details-action-btn"
          onClick={handleEditToggle}
          disabled={loading}
        >
          {isEditMode ? (loading ? "Saving..." : "Save Changes") : "Edit"}
        </button>
      </div>

      {/* Main container */}
      <div className="associate-details-page-container">
        <div className="associate-details-content-card">
          <div className="associate-details-form-wrapper">
            <h2>Change Details:</h2>

            <div className="associate-details-form-row associate-details-two-col">
              <div className="associate-details-form-group">
                <label>Associate Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={isEditMode ? editableInfo.name : associateInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>

              <div className="associate-details-form-group">
                <label>Email ID</label>
                <input
                  type="email"
                  placeholder="email@email.com"
                  value={associateInfo.email}
                  readOnly
                  className="associate-details-readonly-field"
                />
              </div>
            </div>

            <div className="associate-details-form-row associate-details-two-col">
              <div className="associate-details-form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="1234567890"
                  value={isEditMode ? editableInfo.phone_number : associateInfo.phone_number}
                  onChange={(e) => handleInputChange("phone_number", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>

              <div className="associate-details-form-group">
                <label>Sector</label>
                <input
                  type="text"
                  placeholder="Enter sector"
                  value={isEditMode ? editableInfo.sector : associateInfo.sector}
                  onChange={(e) => handleInputChange("sector", e.target.value)}
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div className="associate-details-form-row">
              <div className="associate-details-form-group">
                <label>Role</label>
                <input
                  type="text"
                  placeholder="Role"
                  value={associateInfo.role}
                  readOnly
                  className="associate-details-readonly-field"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userinfo;