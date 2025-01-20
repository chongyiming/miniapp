import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Footer.css";
import logo from "./home.png"; // Adjust the relative path from the file
import user from "./user.png"; // Adjust the relative path from the file
import ranking from "./top-three.png"; // Adjust the relative path from the file
import quest from "./quest.png"; // Adjust the relative path from the file

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <footer className="footer">
      <button
        onClick={() => handleNavigation("/homepage")}
        className={`footer-icon ${activeTab === "/homepage" ? "active" : ""}`}
      >
        <img src={logo} className="icon" />
        <span>Home</span>
      </button>
      <button
        onClick={() => handleNavigation("/profile")}
        className={`footer-icon ${activeTab === "/profile" ? "active" : ""}`}
      >
        <img src={user} className="icon" />

        <span>Profile</span>
      </button>
      <button
        onClick={() => handleNavigation("/tasks")}
        className={`footer-icon ${activeTab === "/tasks" ? "active" : ""}`}
      >
        <img src={quest} className="icon" />

        <span>Tasks</span>
      </button>
      <button
        onClick={() => handleNavigation("/ranking")}
        className={`footer-icon ${activeTab === "/ranking" ? "active" : ""}`}
      >
        <img src={ranking} className="icon" />

        <span>Ranking</span>
      </button>
    </footer>
  );
}

export default Footer;
