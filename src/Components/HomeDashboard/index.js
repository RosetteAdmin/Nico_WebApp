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

const cardsData = [
  {
    title: "Installed Devices",
    value: 6,
    icon: svg1,
    roles: ["Admin", "Company Associate",  "Vendor"],
  },
  {
    title: "Registered Devices",
    value: 812,
    icon: svg2,
    roles: ["Admin", "Company Associate" ,"Vendor"],
  },
  {
    title: "Customers",
    value: 454,
    icon: svg3,
    roles: ["Admin", "Company Associate" ,"Vendor"],
  },
  {
    title: "Associates",
    value: 22,
    icon: svg4,
    roles: ["Admin"],
  },
  {
    title: "Vendors",
    value: 65,
    icon: svg5,
    roles: ["Admin"],
  },
];

const HomeDashboard = ({ title, value, maxValue }) => {
  const [selectedRange, setSelectedRange] = useState("5 days");
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 28;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;
  const [role, setRole] = useState("");
  const userrole = JSON.parse(localStorage.getItem("user")).role;

  // Filter cards based on user role
  const filteredCards = cardsData.filter((card) => card.roles.includes(userrole));

  return (
    <div className="mobile-app-container">
      <div className="quick-statistics-section">
        <div className="heading">
          <h2 className="head">
            <h1>Hello {userrole},</h1>
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