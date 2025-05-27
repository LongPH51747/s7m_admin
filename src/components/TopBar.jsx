import React from "react";
import "../css/TopBar.css";
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
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
        <Link to="/" className="active">Home</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
        <Link to="/signup">Sign Up</Link>
      </div>

      {/* Search + Icons */}
      <div className="right-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="search-input"
          />
          <FiSearch className="search-icon" />
        </div>
        <Link to="/wishlist" className="icon-btn"><FiHeart /></Link>
        <Link to="/cart" className="icon-btn"><FiShoppingCart /></Link>
        <Link to="/user" className="icon-btn"><FiUser /></Link>
      </div>
    </div>
  );
};

export default TopBar;
