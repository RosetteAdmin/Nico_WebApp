import React, { useState, useEffect } from "react";
import "./ChangeProfile.css";

const ChangeProfile = ({onLogout}) => {
  const userrole = JSON.parse(localStorage.getItem("user")).role;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Simulated data fetching
    const user = JSON.parse(localStorage.getItem("user"));
    const pass = user.password.length;
    const savedEmail = user.email || "ca1@niconanobubble.com";
    const savedPassword = '*'.repeat(pass) || "********";
    setFormData((prevData) => ({
      ...prevData,
      email: savedEmail,
      password: savedPassword,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Form saved:", formData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="change-profile-main">
      <div className="change-profile-header">
        <h2>Profile Information</h2>
        <button className="change-profile-logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="change-profile-container">
        <form className="change-profile-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Your Phone Number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Logged In as</label>
            <input id="role" type="text" value={userrole} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Your Location"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Your Password"
              readOnly
            />
          </div>
          <button className="change-profile-save-button" type="button" onClick={handleSave}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeProfile;
