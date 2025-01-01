import React, { useState } from "react";
import "./EditProfile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const EditProfile = ({onLogout}) => {
  const [avatar, setAvatar] = useState("https://via.placeholder.com/80"); // Default placeholder

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for preview
      setAvatar(imageUrl);
    }
  };



  return (
    <div className="edit-profile">
      {/* Header Section */}
      <div className="edit-profile-header">
        <h3 className="edit-profile-heading">Edit Profile</h3>
        <button className="save-button">
          Save <FontAwesomeIcon icon={faCheck} className="icon" />
        </button>
      </div>

      {/* Profile Avatar Section */}
      <div className="profile-avatar">
        <label htmlFor="avatar-upload" className="avatar-upload-label">
          <img src={avatar} alt="User Avatar" />
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          className="avatar-upload"
          onChange={handleAvatarChange}
        />
        <p>Username</p>
      </div>

      {/* Profile Form */}
      <div className="form-container">
        <form className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Name"
              style={{ textAlign: "right" }} // Inline style for right-aligned placeholder
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="name@email.com"
              style={{ textAlign: "right" }} // Inline style for right-aligned placeholder
            />
          </div>
          <div className="form-group">
            <label>Phone number</label>
            <input
              type="tel"
              placeholder="+6589073221"
              style={{ textAlign: "right" }} // Inline style for right-aligned placeholder
            />
          </div>
          <div className="form-group">
            <label>Linked Devices ID</label>
            <input
              type="text"
              placeholder="NICO000234"
              disabled
              style={{ textAlign: "right" }} // Inline style for right-aligned placeholder
            />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="Delhi Zoo"
              style={{ textAlign: "right" }} // Inline style for right-aligned placeholder
            />
          </div>
          <div className="logout-button-container">
            <button
              type="button"
              className="logout-button"
              onClick={onLogout} // Attach the logout handler
            >
              Log Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
