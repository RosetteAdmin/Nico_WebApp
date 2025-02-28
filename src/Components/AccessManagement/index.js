import React from "react";
import "./AccessManagement.css";
import UpArrow from "./../../Images/Dashboard/UpArrow.svg";
import { useNavigate } from "react-router-dom";

const AccessManagement = () => {
  const navigate = useNavigate();

  const cardsData = [
    { title: "Company Associates Access", value: "27", trend: "2.5% Up from last month", link: "/caccess" },
    { title: "Vendor / Service Access", value: "525", trend: "2.5% Up from last month", link: "/vaccess" },
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
            className="access-card clickable"
            onClick={() => handleCardClick(card.link)}
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
