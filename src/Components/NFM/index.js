import React, { useEffect, useState } from "react";

const MaintenancePage = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  return (
    <div className="maintenance-container">
      <div className={`maintenance-card ${fadeIn ? 'fade-in' : ''}`}>
        {/* Background decorative circles */}
        <div className="circle circle-1" />
        <div className="circle circle-2" />

        {/* Content container */}
        <div className="content">
          {/* Icon */}
          <div className="icon-container">
            <div className="icon-background" />
            <svg
              className="maintenance-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 2V4M12 20V22M2 12H4M20 12H22M6.34315 6.34315L7.75736 7.75736M16.2426 16.2426L17.6569 17.6569M6.34315 17.6569L7.75736 16.2426M16.2426 7.75736L17.6569 6.34315"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Text content */}
          <div className="text-content">
            <h1>System Maintenance</h1>
            <div className="message">
              <p className="primary">Page under Maintenance!</p>
              <p className="secondary">
                You've stumbled across a non existing page or feature or we're currently working on it.
                Please check back soon!
              </p>
            </div>

            {/* Button */}
            <div className="button-container">
              <a href="/dashboard">
              <button className="back-button">
                <svg
                  className="back-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Return to Dashboard
              </button>
              </a>
            </div>

            {/* Estimated time */}
            <div className="estimated-time">
              Estimated completion time: 2 hours
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .maintenance-container {
          min-height: 100vh;
          display: flex;
          width:100vw;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .maintenance-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          max-width: 32rem;
          width: 100%;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.5;
        }

        .circle-1 {
          top: -4rem;
          right: -4rem;
          width: 8rem;
          height: 8rem;
          background: #f0f4ff;
        }

        .circle-2 {
          bottom: -4rem;
          left: -4rem;
          width: 8rem;
          height: 8rem;
          background: #e6eeff;
        }

        .content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .icon-container {
          position: relative;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .icon-background {
          position: absolute;
          inset: 0;
          background: #e6f0ff;
          border-radius: 50%;
        }

        .maintenance-icon {
          position: relative;
          width: 6rem;
          height: 6rem;
          color: #3b82f6;
          animation: spin 3s linear infinite;
        }

        .text-content {
          text-align: center;
        }

        h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .message {
          margin-bottom: 2rem;
        }

        .primary {
          font-size: 1.25rem;
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .secondary {
          color: #6b7280;
        }

        .button-container {
          margin-bottom: 1rem;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: #2563eb;
        }

        .back-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
        }

        .estimated-time {
          font-size: 0.875rem;
          color: #6b7280;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .maintenance-card {
            padding: 1.5rem;
          }

          h1 {
            font-size: 1.75rem;
          }

          .primary {
            font-size: 1.125rem;
          }

          .maintenance-icon {
            width: 5rem;
            height: 5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;