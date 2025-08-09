// import React, { useState } from "react";
// import "./AddVendor.css";

// const Userinfo = () => {
//   const [permissions, setPermissions] = useState({
//     nbGenerator: false,
//     ozoneGenerator1: false,
//     ozoneGenerator2: false,
//   });

//   const togglePermission = (key) => {
//     setPermissions((prevPermissions) => ({
//       ...prevPermissions,
//       [key]: !prevPermissions[key],
//     }));
//   };

//   return (
//     <>
//     <div className="grant-access-headerr">
//         <h1 className="vendor-title">Grant Access Permission</h1>
//         <button className="add-vendor-btn">Grant Access</button>
//       </div>
//     <div className="vendor-management-container">
//       {/* Header Section */}
      

//       {/* Content Section with Flexbox */}
//       <div className="vendor-content-wrapper">
//         {/* Left Side - Add or Remove Access */}
//         <div className="form-container">
//           <h2>Add or Remove Access Details:</h2>
//           {/* <div className="form-group">
//             <label>Associate Name</label>
//             <input type="text" placeholder="Name" readOnly/>
//           </div> */}
//           <div className="form-group">
//             <label>Email ID</label>
//             <input type="email" placeholder="email@email.com" readOnly/>
//           </div>
//           <div className="form-group">
//             <label>Password</label>
//             <input type="text" placeholder="Password" readOnly/>
//           </div>
//           {/* <div className="form-group">
//             <label>Phone Number</label>
//             <input type="text" placeholder="1234567890" readOnly/>
//           </div> */}
//           {/* <div className="form-group">
//             <label>Sector</label>
//             <input type="text" placeholder="Sector Name" readOnly />
//           </div> */}
//         </div>

//         {/* Right Side - Device Power Access Permissions */}
//         <div className="permissions-container">
//           <h3>Device Power Access Permission:</h3>
//           <div className="toggle-group">
//             <div>
//               <span>NB Generator</span>
//               <label className="switch">
//                 <input
//                   type="checkbox"
//                   checked={permissions.nbGenerator}
//                   onChange={() => togglePermission("nbGenerator")}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
//             <div>
//               <span>Ozone Generator 1</span>
//               <label className="switch">
//                 <input
//                   type="checkbox"
//                   checked={permissions.ozoneGenerator1}
//                   onChange={() => togglePermission("ozoneGenerator1")}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
//             <div>
//               <span>Ozone Generator 2</span>
//               <label className="switch">
//                 <input
//                   type="checkbox"
//                   checked={permissions.ozoneGenerator2}
//                   onChange={() => togglePermission("ozoneGenerator2")}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Userinfo;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddVendor.css";

const Userinfo = () => {
  const [permissions, setPermissions] = useState({
    nbGenerator: false,
    ozoneGenerator1: false,
    ozoneGenerator2: false,
  });

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    sector: "Karnataka, India"
  });

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
   
    if (id) {
    }
  }, [id]);

  const togglePermission = (key) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [key]: !prevPermissions[key],
    }));
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGrantAccess = async () => {
    // Validate required fields
    if (!userInfo.email || !userInfo.password) {
      alert("Please fill in both email and password fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const confirmCreate = window.confirm(
      `Are you sure you want to create a new Vendor with email: ${userInfo.email}?`
    );
    
    if (!confirmCreate) return;

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_EP}/data/createvendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfo.email,
          password: userInfo.password
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Vendor created successfully!");
        // clear the form or navigate away
        setUserInfo({
          name: "",
          email: "",
          password: "",
          phone: "",
          sector: "Karnataka, India"
        });
        // You could navigate to vendor list or stay on the page
        // navigate("/registeredcompany");
      } else {
        alert(`Failed to create vendor: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      alert("Failed to create vendor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-backdrop">
          <div className="loading-spinner"></div>
          <div className="loading-text">Creating vendor...</div>
        </div>
      )}

      <div className="grant-access-headerr">
        <h1 className="vendor-title">Grant Access Permission</h1>
        <button 
          className="add-vendor-btn" 
          onClick={handleGrantAccess}
          disabled={loading}
        >
          {loading ? "Creating..." : "Grant Access"}
        </button>
      </div>

      <div className="vendor-management-container">
        <div className="vendor-content-wrapper">
          {/* Left Side - Add or Remove Access */}
          <div className="form-container">
            <h2>Add Vendor:</h2>
            {/* <div className="form-group">
              <label>Associate Name</label>
              <input 
                type="text" 
                placeholder="Name" 
                value={userInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div> */}
            <div className="form-group">
              <label>Email ID *</label>
              <input 
                type="email" 
                placeholder="email@email.com" 
                value={userInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input 
                type="text" 
                placeholder="Password" 
                value={userInfo.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>
            {/* <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                placeholder="1234567890" 
                value={userInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div> */}
            {/* <div className="form-group">
              <label>Sector</label>
              <input 
                type="text" 
                placeholder="Sector Name" 
                value={userInfo.sector}
                onChange={(e) => handleInputChange("sector", e.target.value)}
              />
            </div> */}
          </div>

          {/* Right Side - Device Power Access Permissions */}
          <div className="permissions-container">
            <h3>Device Power Access Permission:</h3>
            <div className="toggle-group">
              <div>
                <span>NB Generator</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={permissions.nbGenerator}
                    onChange={() => togglePermission("nbGenerator")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div>
                <span>Ozone Generator 1</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={permissions.ozoneGenerator1}
                    onChange={() => togglePermission("ozoneGenerator1")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div>
                <span>Ozone Generator 2</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={permissions.ozoneGenerator2}
                    onChange={() => togglePermission("ozoneGenerator2")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userinfo;
