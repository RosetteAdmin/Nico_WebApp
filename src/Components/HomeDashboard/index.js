import React from "react";
import "./HomeDashboard.css";
import Box from "./../../Images/Dashboard/Box.svg";
import LinkIcon from "./../../Images/Dashboard/LinkIcon.svg";
import Star from "./../../Images/Dashboard/Star.svg";
import UpArrow from "./../../Images/Dashboard/UpArrow.svg";

const HomeDashboard = () => {
  const cardsData = [
    {
      title: "Total Devices",
      value: "4,689",
      icon: <img src={Box} alt="Total Devices Icon" />, // Placeholder for the icon (can be replaced with an SVG/image)
      trend: "8.5% Up from last month",
    },
    {
      title: "Total Active Devices",
      value: "4,120",
      icon: <img src={LinkIcon} alt="Total Active Devices Icon" />,
      trend: "2.5% Up from last month",
    },
    {
      title: "Total Subscriptions",
      value: "525",
      icon: <img src={Star} alt="Total Subscriptions Icon" />,
      trend: "2.5% Up from last month",
    },
    {
      title: "Other Attributes",
      value: "525",
      icon: <img src={LinkIcon} alt="Other Attributes Icon" />,
      trend: "2.5% Up from last month",
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
              <p className="card-trend">
                <img src={UpArrow} alt="Up Arrow" className="up-arrow-icon" /> {card.trend}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeDashboard;
