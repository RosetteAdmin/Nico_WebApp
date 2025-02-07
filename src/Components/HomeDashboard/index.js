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

  // Scroll handler for left and right buttons
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

  // Determine card size and layout based on screen width
  const getCardStyles = () => {
    if (screenWidth < 600) {
      return {
        maxHeight: "150px",
        maxWidth: "300px",
        fontSize: "0.9rem",
        right: 260,
        marginLeft: "15%",
      };
    } else if (screenWidth < 800) {
      return {
        maxHeight: "200px",
        maxWidth: "350px",
        fontSize: "1rem",
        right: 240,
        marginLeft: "13%",
      };
    } else if (screenWidth < 1200) {
      return {
        maxHeight: "230px",
        maxWidth: "400px",
        fontSize: "1.1rem",
        right: 220,
        marginLeft: "12%",
      };
    } else {
      return {
        maxHeight: "200px",
        maxWidth: "450px",
        fontSize: "1.2rem",
        right: 50,
        marginLeft: "5%",
      };
    }
  };

  return (
    <div style={{ height: "50vh", width: "75vw", marginLeft: getCardStyles().marginLeft, position: "relative", top: 30 }}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Dashboard
        </h1>
        <div className="independent-arrow-buttons">
          <button className="independent-arrow-button" onClick={scrollLeft}>
            <img src={LeftArrow} alt="Left Arrow" />
          </button>
          <button className="independent-arrow-button" onClick={scrollRight}>
            <img src={RightArrow} alt="Right Arrow" />
          </button>
        </div>
      </div>
  
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
        <div ref={scrollRef} className="dashboard-scroll-container" style={{ marginBottom: "150px", display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: "1rem", padding: "1rem 0", scrollSnapType: "x mandatory" }}>
          {cardsData.map((card, index) => (
            <div key={index} className="dashboard-card" style={{ backgroundColor: "white", borderRadius: "10px", padding: "1rem", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)", transition: "transform 0.2s ease, box-shadow 0.2s ease", width: "100%", maxWidth: "250px", minWidth: "200px", flex: "1 1 calc(25% - 1.5rem)", height: "100px", display: "flex", alignItems: "center", marginTop: "20px" }}>
              <div className="card-icon" style={{ marginRight: "1rem", flexShrink: 0 }}>
                {card.icon}
              </div>
              <div className="card-content" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
                <h3 className="card-title" style={{ fontSize: "1rem", fontWeight: "bold", margin: "0" }}>
                  {card.title}
                </h3>
                <p className="card-value" style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#0c5890", textAlign: "center", flexShrink: 0, paddingBottom: "21px", paddingRight: "1px" }}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;