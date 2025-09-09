import React from "react";
import "../css/TopBar.css";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="topbar">
      {/* Logo */}
      <div className="logo">
        <span className="bold">S7M</span> STORE
      </div>

      {/* Navigation */}
      <div className="nav">
        <Link to="/home" >Home</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
        <Link to="/signup">Sign Up</Link>
      </div>

    </div>
    
  );
};

export default TopBar;
