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
};

export default LoginPage;