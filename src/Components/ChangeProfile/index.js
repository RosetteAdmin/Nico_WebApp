import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChangeProfile.css";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile Information</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <form className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" placeholder="Your Name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value="ca1@niconanobubble.com" readOnly />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" placeholder="365451354415" />
        </div>
        <div className="form-group">
          <label>Logged In as</label>
          <input type="text" value="Company Associate" readOnly />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" placeholder="Manipal, Karnataka" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value="********" readOnly />
        </div>
        <button className="save-button" type="button">
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
