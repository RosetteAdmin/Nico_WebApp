import React, { useRef, useState, useEffect } from "react";
import "./HomeDashboard.css";
import Box from "./../../Images/Dashboard/Box.svg";
import LinkIcon from "./../../Images/Dashboard/LinkIcon.svg";
import Star from "./../../Images/Dashboard/Star.svg";
import UpArrow from "./../../Images/Dashboard/UpArrow.svg";

const HomeDashboard = () => {
  const scrollRef = useRef(null); // Reference for scrolling
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Listen for window resize to update screenWidth state
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardsData = [
    {
      title: "Total Devices",
      value: "4,689",
      icon: <img src={Box} alt="Total Devices Icon" />,
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
    {
      title: "Total Devices",
      value: "4,689",
      icon: <img src={Box} alt="Total Devices Icon" />,
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
        maxWidth: "150px",
        fontSize: "0.9rem",
        right: 260,
        marginLeft:"15%",
      };
    } else if (screenWidth < 800) {
      return {
        maxHeight: "200px",
        maxWidth: "200px",
        fontSize: "1rem",
        right: 240,
        marginLeft:"13%",
      };
    } else if (screenWidth < 1200) {
      return {
        maxHeight: "230px",
        maxWidth: "230px",
        fontSize: "1.1rem",
        right: 220,
        marginLeft:"12%",
      };
    } else {
      return {
        maxHeight: "200px",
        maxWidth: "200px",
        fontSize: "1.2rem",
        right: 50,
        marginLeft:"5%",
      };
    }
  };



  return (
    <div style={{ height: "50vh", width: "75vw", marginLeft: getCardStyles().marginLeft, position: "relative", top: 40 }}>
      <div style={{ display: "flex" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", textAlign: "left" }}>
          Dashboard
        </h1>
        <div style={{ display: "flex", alignItems: "center", position: "absolute", right: getCardStyles().right, top: 20 }}>
          {/* Left Scroll Button */}
          <button
            onClick={scrollLeft}
            style={{
              background: "#E2EAF8",
              border: "none",
              cursor: "pointer",
              padding: "12px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              fontSize: "1.2rem",
              color: "black",
              transition: "all 0.3s ease",
              marginRight: "1rem",
            }}
          >
            &lt;
          </button>

          {/* Right Scroll Button */}
          <button
            onClick={scrollRight}
            style={{
              background: "#E2EAF8",
              border: "none",
              cursor: "pointer",
              padding: "12px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              fontSize: "1.2rem",
              color: "black",
              transition: "all 0.3s ease",
            }}
          >
            &gt;
          </button>
        </div>
      </div>

      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={scrollRef}
          className="dashboard-scroll-container"
          style={{
            marginBottom: "150px",
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            gap: "1rem",
            padding: "1rem 0",
            scrollSnapType: "x mandatory",
          }}
        >
          {cardsData.map((card, index) => (
            <div
              key={index}
              className="dashboard-card"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "1rem",
                maxHeight: getCardStyles().maxHeight,
                maxWidth: getCardStyles().maxWidth,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                flexShrink: 0,
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center", // Align items in the row
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <div className="card-header" style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                  <h3 className="card-title" style={{ fontSize: getCardStyles().fontSize, fontWeight: "bold", margin: "0" }}>
                    {card.title}
                  </h3>
                  <p className="card-value" style={{ fontSize: getCardStyles().fontSize, margin: "5px 0" }}>
                    {card.value}
                  </p>
                </div>
                <div className="card-trend" style={{ fontSize: "0.9rem", color: "green", display: "flex", alignItems: "center" }}>
                  <img
                    src={UpArrow}
                    alt="Up Arrow"
                    style={{ width: getCardStyles().fontSize, height: "10px", marginRight: "5px" ,}}
                  />
                    <p className="card-value" style={{ fontSize: getCardStyles().fontSize, margin: "5px 0",color:"black" }}>  {card.trend}</p>
                
                </div>
              </div>

              <div className="card-icon" style={{ width: "55px", height: "55px", marginLeft: "10px", background: "#C4D3F9", borderRadius: "20%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
