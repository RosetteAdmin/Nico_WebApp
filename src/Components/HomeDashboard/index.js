import React from "react";
import { useEffect, useState } from "react";
import "./HomeDashboard.css";
import Package from "./../../Images/Dashboard/Package.svg";
import MobileUser from "./../../Images/Dashboard/MobileUser.svg";
import Users from "./../../Images/Dashboard/Users.svg";

const HomeDashboard = () => {
  const [data, setData] = useState({
    registered_devices: 4,
    pre_registered_devices: 2,
    company_associates: 3,
    vendor_service_agents: 3,
    users: 6,
    yetToAdd: 6, // This key is missing in the API response, so keep a default value
  });
  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/dashboard`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success" && result.data) {
          setData((prevData) => ({
            ...prevData,
            ...result.data, // Update with API response while keeping yetToAdd
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, []);  

  const cardsData = [
    {
      title: "Registered Devices",
      value: data.registered_devices,
      icon: <img src={Package} alt="Registered Devices Icon" />,
    },
    {
      title: "Pre-registered Devices",
      value: data.pre_registered_devices,
      icon: <img src={Package} alt="Pre-registered Devices Icon" />,
    },
    {
      title: "Company Associates",
      value: data.company_associates,
      icon: <img src={Users} alt="Company Associates Icon" />,
    },
    {
      title: "Vendors / Service Agents",
      value: data.vendor_service_agents,
      icon: <img src={Users} alt="Vendors/Service Agents Icon" />,
    },
    {
      title: "Mobile App Users",
      value: data.users,
      icon: <img src={MobileUser} alt="Mobile App Users Icon" />,
    },
    {
      title: "Yet to Add",
      value: data.yetToAdd,
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
