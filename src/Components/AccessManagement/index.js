// import React from "react";
// import "./AccessManagement.css";
// import UpArrow from "./../../Images/Dashboard/UpArrow.svg";
// import { useNavigate } from "react-router-dom";

// const AccessManagement = () => {
//   const navigate = useNavigate();

//   const cardsData = [
//     { title: "Company Associates Access", value: "27", trend: "2.5% Up from last month", link: "/caccess" },
//     { title: "Vendor / Service Access", value: "525", trend: "2.5% Up from last month", link: "/vaccess" },
//   ];

//   const handleCardClick = (link) => {
//     if (link) {
//       navigate(link);
//     }
//   };

//   return (
//     <div className="access-management">
//       <h1 className="access-title">Access Management</h1>
//       <div className="access-cards-container">
//         {cardsData.map((card, index) => (
//           <div
//             key={index}
//             className="access-card clickable"
//             onClick={() => handleCardClick(card.link)}
//           >
//             <div className="card-header">
//               <h3 className="card-title">{card.title}</h3>
//               <p className="card-value">{card.value}</p>
//             </div>
//             <div className="card-trend">
//               <img src={UpArrow} alt="Up Arrow" className="trend-icon" />
//               <p className="trend-text">{card.trend}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AccessManagement;


import React, { useState, useEffect } from "react";
import "./AccessManagement.css";
import UpArrow from "./../../Images/Dashboard/UpArrow.svg";
import { useNavigate } from "react-router-dom";
import { Role } from "../../constants/roles";

const AccessManagement = () => {
  const navigate = useNavigate();

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();
  const userRole  = storedUser?.role !== undefined ? Number(storedUser.role) : null;
  const userEmail = storedUser?.email || "";

  const [counts, setCounts] = useState({
    companyAdmins: 0,
    customerAdmins: 0,
    operators: 0,
  });

  useEffect(() => {
    const EP = process.env.REACT_APP_EP;

    const fetchCount = async (url) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data.value)) return data.value.length;
        if (Array.isArray(data.data)) return data.data.length;
        return 0;
      } catch {
        return 0;
      }
    };

    (async () => {
      const vendorsUrl  = `${EP}/data/vendors?caller_email=${encodeURIComponent(userEmail)}&caller_role=${userRole}`;
      const customersUrl = `${EP}/data/customers?caller_email=${encodeURIComponent(userEmail)}&caller_role=${userRole}`;

      const [companyAdmins, customerAdmins, operators] = await Promise.all([
        userRole === Role.MasterAdmin ? fetchCount(`${EP}/data/companyassociates`) : Promise.resolve(0),
        (userRole === Role.MasterAdmin || userRole === Role.CompanyAdmin) ? fetchCount(vendorsUrl) : Promise.resolve(0),
        (userRole <= Role.CustomerAdmin) ? fetchCount(customersUrl) : Promise.resolve(0),
      ]);

      setCounts({ companyAdmins, customerAdmins, operators });
    })();
  }, [userRole, userEmail]);

  // Build cards based on role
  const allCards = [
    {
      title: "Company Admins",
      key: "companyAdmins",
      link: "/caccess",
      roles: [Role.MasterAdmin],
    },
    {
      title: "Customer Admins",
      key: "customerAdmins",
      link: "/vaccess",
      roles: [Role.MasterAdmin, Role.CompanyAdmin],
    },
    {
      title: "Operators",
      key: "operators",
      link: "/customers",
      roles: [Role.MasterAdmin, Role.CompanyAdmin, Role.CustomerAdmin],
    },
  ];

  const visibleCards = allCards.filter((c) => c.roles.includes(userRole));

  const handleCardClick = (link) => { if (link) navigate(link); };

  return (
    <div className="access-management">
      <h1 className="access-title">Access Management</h1>
      <div className="access-cards-container">
        {visibleCards.map((card, index) => (
          <div
            key={index}
            className="access-card clickable"
            onClick={() => handleCardClick(card.link)}
          >
            <div className="card-header">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-value">{counts[card.key]}</p>
            </div>
            <div className="card-trend">
              <img src={UpArrow} alt="Up Arrow" className="trend-icon" />
              <p className="trend-text">Manage {card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessManagement;