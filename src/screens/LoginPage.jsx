import React from "react";
import "../css/LoginPage.css";
import logo from "../image/logoStore-removebg-preview.png";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("./home"); // Đường dẫn tới HomeProduct, chỉnh lại nếu route khác
  };

  return (
    <>
      <div className="top-bar"></div>
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-left">
            <img className="logo-image" src={logo} alt="Logo S7MStore" />
          </div>
          <div className="login-right">
            <h2>Log in to S7M STORE</h2>
            <p className="login-desc">Enter your details below</p>
            <input className="login-input" type="text" placeholder="Email or Phone Number" />
            <input className="login-input" type="password" placeholder="Password" />
            <div className="login-actions">
              <button className="login-button" onClick={handleLogin}>Log In</button>
              <a href="/" className="forgot-link">
                Forget Password?
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default LoginPage;
