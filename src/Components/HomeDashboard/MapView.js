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
  const [devices, setDevices] = useState([]);

  // 🔹 Convert sector → coordinates using Mapbox Geocoding API
  const getCoordinatesFromSector = async (sector) => {
    try {
      const geoResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          sector
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const geoData = await geoResponse.json();
      if (geoData.features && geoData.features.length > 0) {
        return geoData.features[0].center; // [lng, lat]
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
    return null;
  };

  // 🔹 Fetch devices and enrich with coordinates + status
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EP}/api/devices`);
        const data = await response.json();
        const azureDevices = data.value || [];

        const devicesWithInfo = await Promise.all(
          azureDevices.map(async (device) => {
            try {
              const infoRes = await fetch(
                `${process.env.REACT_APP_EP}/data/devices/${device.id}/info`
              );
              const infoData = await infoRes.json();

              // Fetch connection status
              let connectionStatus = "Disconnected";
              try {
                const statusResponse = await fetch(
                  `${process.env.REACT_APP_EP}/api/devices/${device.id}/status`
                );
                const statusData = await statusResponse.json();
                connectionStatus =
                  statusData.status === "Connected"
                    ? "Connected"
                    : "Disconnected";
              } catch (statusError) {
                console.error(`Status fetch failed for ${device.id}`, statusError);
              }

              if (infoData.status === "success" && infoData.data) {
                const sector = infoData.data.location || "Karnataka";
                const coords = await getCoordinatesFromSector(sector);

                if (coords) {
                  return {
                    id: device.id,
                    name: device.displayName,
                    sector: sector,
                    owner: infoData.data.owner_name || "N/A",
                    coordinates: coords,
                    status: connectionStatus,
                  };
                }
              }
            } catch (err) {
              console.error("Error fetching info for device:", err);
            }
            return null;
          })
        );

        const validDevices = devicesWithInfo.filter(Boolean);
        setDevices(validDevices);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setError("Failed to fetch device data.");
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  // 🔹 Initialize map when devices are loaded
  useEffect(() => {
    if (!devices.length || mapRef.current) return;

    const initMap = () => {
      try {
        if (!mapboxgl.accessToken) {
          throw new Error("Mapbox token missing. Please check your .env file.");
        }

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
center: [78.9629, 20.5937], // India center
zoom: 4.5,
          interactive: true,
        });

        mapRef.current = map;
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
          const bounds = new mapboxgl.LngLatBounds();

          devices.forEach((machine) => {
            const el = document.createElement("div");
            el.className = "custom-marker";

            // ✅ Marker color depends on status
            const markerColor =
              machine.status === "Connected" ? "#00ff00" : "#ff0000";

            el.innerHTML = `
              <div class="marker-pin" style="background:${markerColor}"></div>
              <div class="marker-pulse" style="background:${markerColor}33"></div>
            `;

            new mapboxgl.Marker({ element: el, anchor: "bottom" })
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
                    <small><b>Owner:</b> ${machine.owner}</small><br/>
                    <small><b>Status:</b> ${machine.status}</small>
                  </div>
                `)
              )
              .addTo(map);

            // Extend bounds to include each marker
            bounds.extend(machine.coordinates);
          });

          // ✅ Fit all markers in the map view
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { padding: 80 });
            map.once("moveend", () => {
  map.zoomOut(1); // zooms out one level more
});
          }
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
  }, [devices]);

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
