import React, { useState } from "react";
import "./HomeDashboard.css";
import Package from "./../../Images/Dashboard/Package.svg";
import MobileUser from "./../../Images/Dashboard/MobileUser.svg";
import Users from "./../../Images/Dashboard/Users.svg";
import Loading from "./../../Images/Dashboard/loading.svg";
import blueband from "./../../Images/Dashboard/blueband.svg";
import Ellipse from "./../../Images/Dashboard/Ellipse.svg";
import svg1 from "./../../Images/Dashboard/svg1.svg";
import svg2 from "./../../Images/Dashboard/svg2.svg";
import svg3 from "./../../Images/Dashboard/svg3.svg";
import svg4 from "./../../Images/Dashboard/svg4.svg";
import svg5 from "./../../Images/Dashboard/svg5.svg";

// Import centralized role management
import { Role, roleToString } from "../../constants/roles";

const cardsData = [
  {
    title: "Installed Devices",
    value: 6,
    icon: svg1,
    roles: [Role.Admin, Role.CompanyAssociate, Role.Vendor],
  },
  {
    title: "Registered Devices",
    value: 812,
    icon: svg2,
    roles: [Role.Admin, Role.CompanyAssociate, Role.Vendor],
  },
  {
    title: "Customers",
    value: 454,
    icon: svg3,
    roles: [Role.Admin, Role.CompanyAssociate, Role.Vendor],
  },
  {
    title: "Associates",
    value: 22,
    icon: svg4,
    roles: [Role.Admin],
  },
  {
    title: "Vendors",
    value: 65,
    icon: svg5,
    roles: [Role.Admin],
  },
];

const HomeDashboard = ({ title, value, maxValue }) => {
  const [selectedRange, setSelectedRange] = useState("5 days");
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 28;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  // Parse stored user role as integer
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser && storedUser.role !== undefined ? parseInt(storedUser.role, 10) : null;

  // Filter cards for the current userRole
  const filteredCards = cardsData.filter((card) => card.roles.includes(userRole));

  return (
    <div className="mobile-app-container">
      <div className="quick-statistics-section">
        <div className="heading">
          <h2 className="head">
            <h1>Hello {roleToString(userRole)},</h1>
            <br />
            Our commitment to excellence has driven us to develop state-of-the-art NICO Nanobubble Generators, Mixers, and Ozone & Oxygen Generators. We are dedicated to creating ground-breaking
            technologies that address the evolving needs of such critical industries while ensuring energy efficiency for end users.
          </h2>
        </div>

        <div className="quick-statistics">
          <div className="statss-cards">
            {filteredCards.map((card, index) => (
              <div key={index} className="stat-card">
                <div className="progress-circle">
                  <img src={card.icon} className="ellipse" alt={`${card.title} icon`} />
                  {card.title === "Installed Devices" && (
                    <div className="arrow-icons">
                      <i className="fa fa-angle-double-up" aria-hidden="true"></i>
                    </div>
                  )}
                </div>
                <div className="stat-details">
                  <p>{card.title}</p>
                  <h3>{card.value}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
