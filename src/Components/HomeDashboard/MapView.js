// src/Components/HomeDashboard/MapView.js
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapView.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapView = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟩 Static machine location data
  const machines = [
    {
      id: "1234567",
      name: "Qwerty",
      sector: "Manipal",
      owner: "Likith",
      coordinates: [74.7851, 13.3543], // Manipal
    },
    {
      id: "12345677899",
      name: "sdgssdgs",
      sector: "Manipal",
      owner: "sdg",
      coordinates: [74.7865, 13.3560], // Near Manipal
    },
    {
      id: "tester",
      name: "test",
      sector: "Karnataka",
      owner: "test",
      coordinates: [75.7139, 15.3173], // Karnataka approx center
    },
    {
      id: "898989",
      name: "Abcd",
      sector: "Hassan",
      owner: "Abhi",
      coordinates: [76.0996, 13.0072], // Hassan
    },
    // {
    //   id: "dfsjkvnfcdf",
    //   name: "Test_device",
    //   sector: "Manipal",
    //   owner: "Leroy",
    //   coordinates: [74.7848, 13.3529], // Manipal
    // },
  ];

  useEffect(() => {
    if (mapRef.current) return;

    const initMap = () => {
      try {
        if (!mapboxgl.accessToken) {
          throw new Error("Mapbox token missing. Please check your .env file.");
        }

        // 🗺️ Center map on Karnataka
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [75.7139, 15.3173], // Karnataka
          zoom: 7,
          interactive: true,
        });

        mapRef.current = map;

        // Add zoom + rotation controls
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
          // Add marker for each machine
          machines.forEach((machine) => {
            const el = document.createElement("div");
            el.className = "custom-marker";
            el.innerHTML = `
              <div class="marker-pin"></div>
              <div class="marker-pulse"></div>
            `;

            new mapboxgl.Marker({
              element: el,
              anchor: "bottom",
            })
              .setLngLat(machine.coordinates)
              .setPopup(
                new mapboxgl.Popup({
                  offset: 25,
                  closeButton: true,
                  closeOnClick: false,
                }).setHTML(`
                  <div class="custom-popup">
                    <strong>📟 Device Name:</strong> ${machine.name}<br/>
                    <small><b>ID:</b> ${machine.id}</small><br/>
                    <small><b>Sector:</b> ${machine.sector}</small><br/>
                    <small><b>Owner:</b> ${machine.owner}</small>
                  </div>
                `)
              )
              .addTo(map);
          });

          setLoading(false);
        });

        map.on("error", (e) => {
          console.error("Map error:", e);
          setError("Failed to load map.");
        });
      } catch (err) {
        console.error("Map initialization error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="map-wrapper">
      {loading && !error && (
        <div className="map-loading">
          <div className="spinner"></div>
          <p>Loading map...</p>
        </div>
      )}

      {error ? (
        <div className="map-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div
          ref={mapContainerRef}
          className="map-container"
          style={{ visibility: loading ? "hidden" : "visible" }}
        />
      )}
    </div>
  );
};

export default MapView;
