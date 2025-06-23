import React from "react";
import { Button, Form, Input } from "antd";
import "../css/LoginPage.css";
import logo from "../image/logoStore-removebg-preview.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
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
            <Form onFinish={handleLogin}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input placeholder="Email or Phone Number" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-button">
                  Log In
                </Button>
              </Form.Item>
            </Form>
            <a href="/" className="forgot-link">
              Forget Password?
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
