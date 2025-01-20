import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "./logo192.png";

function Header() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setUsername(localStorage.getItem("username") || "");
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="header">
      <img src={logo} className="logo" alt="Logo" />
      {username && (
        <div className="header-right">
          <div className="upperRight">{username}</div>
          <button className="logout-button" onClick={clearLocalStorage}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
