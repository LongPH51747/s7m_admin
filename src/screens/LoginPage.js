<<<<<<< HEAD
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
      const response = await axiosInstance.post(
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
      
      // Lấy token và user info từ response (tương tự React Native app)
      const token = response.data?.user?.access_token;
      const user = response.data?.user?.user;
      
      if (token) {
        // Lưu token vào localStorage để sử dụng cho comment
        localStorage.setItem('token', token);
        localStorage.setItem('adminId', user?._id || 'admin');
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Log token để kiểm tra
        console.log('🎉 Đăng nhập thành công!');
        console.log('📱 Access Token:', token);
        console.log('👤 User Info:', user);
        console.log('💾 Token đã được lưu vào localStorage');
      } else {
        console.warn('⚠️ Không tìm thấy access_token trong response');
      }
      
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
=======
// src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/LoginForm';
import Footer from '../components/Footer';
import '../css/LoginPage.css';



const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-wrapper"> {/* <-- CONTAINER MỚI */}
                <div className="login-logo-section"> {/* <-- PHẦN CHỨA LOGO */}
                    <img src={require('../logo.png')} alt="S7M STORE Logo" />
                </div>
                <div className="login-form-container-wrapper"> {/* <-- PHẦN CHỨA FORM */}
                    <LoginForm />
                </div>
            </div>
            <Footer />
        </div>
    );
>>>>>>> Origin/Bao
};

export default LoginPage;