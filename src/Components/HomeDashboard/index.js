import React, { useRef, useState, useEffect } from "react";
import "./HomeDashboard.css";
import Package from "./../../Images/Dashboard/Package.svg";
import MobileUser from "./../../Images/Dashboard/MobileUser.svg";
import Users from "./../../Images/Dashboard/Users.svg";
import LeftArrow from "./../../Images/Dashboard/Left.svg";
import RightArrow from "./../../Images/Dashboard/Rightarrow.svg";

const HomeDashboard = () => {
  const scrollRef = useRef(null); // Reference for scrolling
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Listen for window resize to update screenWidth state
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [data, setData] = useState({
    registered_devices: 0,
    pre_registered_devices: 0,
    company_associates: 0,
    vendor_service_agents: 0,
    users: 0,
    yetToAdd: 0,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_EP}/data/dashboard`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success" && result.data) {
          setData((prevData) => ({
            ...prevData,
            ...result.data,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  });

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

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
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dependent-arrow-buttons">
          <button className="dependent-arrow-button" onClick={scrollLeft}>
            <img src={LeftArrow} alt="Left Arrow" />
          </button>
          <button className="dependent-arrow-button" onClick={scrollRight}>
            <img src={RightArrow} alt="Right Arrow" />
          </button>
        </div>
      </div>
      <div className="dashboard-cards" ref={scrollRef}>
        {cardsData.map((card, index) => (
          <div key={index} className="dashboard-card">
            <div className="card-icon">{card.icon}</div>
            <div className="card-content">
              <div className="card-title">{card.title}</div>
              <div className="card-value">{card.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeDashboard;