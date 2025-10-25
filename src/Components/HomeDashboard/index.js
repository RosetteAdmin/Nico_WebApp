// 

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./HomeDashboard.css";
import MapView from "./MapView";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


import Loading from "./../../Images/Dashboard/loading.svg";
import svg1 from "./../../Images/Dashboard/svg1.svg";
import svg2 from "./../../Images/Dashboard/svg2.svg";
import svg3 from "./../../Images/Dashboard/svg3.svg";
import svg4 from "./../../Images/Dashboard/svg4.svg";
import svg5 from "./../../Images/Dashboard/svg5.svg";

// Import centralized role management
import { Role, roleToString } from "../../constants/roles";

// Static card metadata with routes
const baseCards = [
  {
    key: "installedDevices",
    title: "Installed Devices",
    icon: svg1,
    roles: [Role.Admin, Role.CompanyAssociate, Role.Vendor],
    route: "/devices", // adjust to your actual route
  },
  {
    key: "registeredDevices",
    title: "Registered Devices",
    icon: svg2,
    roles: [Role.Admin, Role.CompanyAssociate, Role.Vendor],
    route: "/PreRegDevices",
  },
   {
    key: "associates",
    title: "Associates",
    icon: svg4,
    roles: [Role.Admin],
    route: "/caccess",
  },
  {
    key: "localAdmins",
    title: "Local Admins",
    icon: svg5,
    roles: [Role.Admin, Role.CompanyAssociate],
    route: "/vaccess",
  },
  {
    key: "operators",
    title: "Operators",
    icon: svg3,
    roles: [Role.Admin, Role.CompanyAssociate, Role.Vendor],
    route: "/customers",
  },
 
  
];

const HomeDashboard = () => {
  // Parse stored user role as integer
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole =
    storedUser && storedUser.role !== undefined
      ? parseInt(storedUser.role, 10)
      : null;

  // Counts state
  const [counts, setCounts] = useState({
    installedDevices: 0,
    registeredDevices: 0,
    operators: 0,
    associates: 0,
    localAdmins: 0,
  });
  const [countsLoading, setCountsLoading] = useState(true);

  // Helper to normalize different payload shapes to a count
  const getCountFromPayload = (payload) => {
    if (!payload) return 0;
    if (Array.isArray(payload)) return payload.length;
    if (Array.isArray(payload.value)) return payload.value.length; // e.g., { value: [...] }
    if (Array.isArray(payload.data)) return payload.data.length;   // e.g., { data: [...] }
    if (payload.status === "success" && Array.isArray(payload.data)) return payload.data.length;
    if (typeof payload.count === "number") return payload.count;
    return 0;
  };

  useEffect(() => {
    const EP = process.env.REACT_APP_EP;
    const ac = new AbortController();

    const fetchJson = async (url) => {
      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return res.json();
    };

    (async () => {
      try {
        setCountsLoading(true);
        const [
          installedRes,
          registeredRes,
          operatorsRes,
          associatesRes,
          localAdminsRes,
        ] = await Promise.allSettled([
          fetchJson(`${EP}/api/devices`),            // Installed Devices
          fetchJson(`${EP}/data/getprdevices`),      // Registered Devices
          fetchJson(`${EP}/data/customers`),         // Operators
          fetchJson(`${EP}/data/companyassociates`), // Associates
          fetchJson(`${EP}/data/vendors`),           // Local Admins
        ]);

        const unwrap = (r) => (r.status === "fulfilled" ? r.value : null);

        setCounts({
          installedDevices: getCountFromPayload(unwrap(installedRes)),
          registeredDevices: getCountFromPayload(unwrap(registeredRes)),
          operators: getCountFromPayload(unwrap(operatorsRes)),
          associates: getCountFromPayload(unwrap(associatesRes)),
          localAdmins: getCountFromPayload(unwrap(localAdminsRes)),
        });
      } catch (e) {
        console.error("Failed to load dashboard counts:", e);
      } finally {
        setCountsLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  // Merge live counts into cards, then filter by role
  const cards = useMemo(
    () =>
      baseCards.map((c) => ({
        ...c,
        value: counts[c.key] ?? 0,
      })),
    [counts]
  );

  const filteredCards = useMemo(
    () => cards.filter((card) => card.roles.includes(userRole)),
    [cards, userRole]
  );
const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePrev = () => {
    setCurrentCardIndex((prev) =>
      prev > 0 ? prev - 1 : filteredCards.length - 1
    );
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) =>
      prev < filteredCards.length - 1 ? prev + 1 : 0
    );
  };
   return (
    <div className="mobile-app-container">
      <div className="quick-statistics-section">
        <div className="heading">
          <h2 className="head">
            <h1>Hello {roleToString(userRole)},</h1>
            <br />
            Our commitment to excellence has driven us to develop
            state-of-the-art NICO Nanobubble Generators, Mixers, and Ozone &
            Oxygen Generators. We are dedicated to creating ground-breaking
            technologies that address the evolving needs of such critical
            industries while ensuring energy efficiency for end users.
          </h2>
        </div>

        {/* Cards Section */}
        <div className="quick-statistics">
          <div className="statss-cards">
            {filteredCards.map((card, index) => (
              <Link
                key={card.key}
                to={card.route}
                className={`stat-card-link ${
                  index === currentCardIndex ? "active" : "hidden-card"
                }`}
              >
                <div className="stat-card">
                  <div className="progress-circle">
                    <img
                      src={card.icon}
                      className="ellipse"
                      alt={`${card.title} icon`}
                    />
                    {card.title === "Installed Devices" && (
                      <div className="arrow-icons">
                        <i
                          className="fa fa-angle-double-up"
                          aria-hidden="true"
                        ></i>
                      </div>
                    )}
                  </div>
                  <div className="stat-details">
                    <p>{card.title}</p>
                    <h3>
                      {countsLoading ? (
                        <img
                          src={Loading}
                          alt="loading"
                          style={{ height: 18 }}
                        />
                      ) : (
                        card.value
                      )}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Slide Controls */}
          <div className="slider-controls">
            <button className="slide-btn left" onClick={handlePrev}>
              <FaChevronLeft />
            </button>
            <button className="slide-btn right" onClick={handleNext}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          {/* <div className="left-vertical-cards">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="info-card">
                <h3>Card {num} Title</h3>
                <p>
                  This is some dummy text for card {num}. It can be replaced
                  later with actual content.
                </p>
              </div>
            ))}
          </div> */}

          <div className="right-map-placeholder">
            <MapView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;