import React from "react";
// import { useEffect, useState } from "react";
import "./HomeDashboard.css";
import Package from "./../../Images/Dashboard/Package.svg";
import MobileUser from "./../../Images/Dashboard/MobileUser.svg";
import Users from "./../../Images/Dashboard/Users.svg";

const HomeDashboard = () => {
  // const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Update screenWidth on window resize
  // useEffect(() => {
  //   const handleResize = () => setScreenWidth(window.innerWidth);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const cardsData = [
    {
      title: "Registered Devices",
      value: "4",
      icon: <img src={Package} alt="Registered Devices Icon" />,
    },
    {
      title: "Pre-registered Devices",
      value: "2",
      icon: <img src={Package} alt="Pre-registered Devices Icon" />,
    },
    {
      title: "Company Associates",
      value: "3",
      icon: <img src={Users} alt="Company Associates Icon" />,
    },
    {
      title: "Vendors / Service Agents",
      value: "3",
      icon: <img src={Users} alt="Vendors/Service Agents Icon" />,
    },
    {
      title: "Mobile App Users",
      value: "6",
      icon: <img src={MobileUser} alt="Mobile App Users Icon" />,
    },
    {
      title: "Yet to Add",
      value: "6",
      icon: <img src={Users} alt="Yet to Add Icon" />,
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-cards">
        {cardsData.map((card, index) => (
          <div key={index} className="dashboard-card">
            <div className="card-icon">{card.icon}</div>
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeDashboard;
