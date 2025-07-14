import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import "../css/LoginPage.css";
import logo from "../image/logoStore-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../config/axios';
import { API_BASE } from '../config/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    setLoginError("");
    try {
      await axiosInstance.post(
        `${API_BASE}/api/auth/login-username`,
        {
          username: values.username,
          password: values.password,
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      // Đăng nhập thành công
      console.log('Đăng nhập thành công với username:', values.username);
      navigate("/home");
    } catch (error) {
      setLoginError("Sai tài khoản hoặc mật khẩu vui lòng nhập lại");
      console.error('Lỗi đăng nhập:', error);
    } finally {
      setLoading(false);
    }
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
              {loginError && (
                <div style={{ color: 'red', marginBottom: 12 }}>{loginError}</div>
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-button" loading={loading}>
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
}
export default LoginPage