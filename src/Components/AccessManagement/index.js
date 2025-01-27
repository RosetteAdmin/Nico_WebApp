import React from "react";
import "./AccessManagement.css";
import UpArrow from "./../../Images/Dashboard/UpArrow.svg";
import { useNavigate } from "react-router-dom";

const AccessManagement = () => {
  const navigate = useNavigate();

  const cardsData = [
    { title: "Admin Access", value: "1", trend: "Admin Access Only" },
    { title: "Company Associates Access", value: "27", trend: "2.5% Up from last month", link: "/dashboard" },
    { title: "Vendor / Service Access", value: "525", trend: "2.5% Up from last month", link: "/dashboard" },
    { title: "Other Access Permissions", value: "70", trend: "2.5% Up from last month" },
  ];

  const handleCardClick = (link) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="access-management">
      <h1 className="access-title">Access Management</h1>
      <div className="access-cards-container">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className={`access-card ${card.link ? "clickable" : ""}`}
            onClick={() => card.link && handleCardClick(card.link)}
          >
            <div className="card-header">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-value">{card.value}</p>
            </div>
            <div className="card-trend">
              <img src={UpArrow} alt="Up Arrow" className="trend-icon" />
              <p className="trend-text">{card.trend}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default AccessManagement;
