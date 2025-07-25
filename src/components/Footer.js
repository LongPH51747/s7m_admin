// src/components/Footer.js
import React from 'react';
import '../Footer.css'; // Tạo file CSS tương ứng

// Import các icon nếu cần (Ví dụ: dùng react-icons)
// npm install react-icons
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa';



const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h3>Exclusive</h3>
                    <h4>Subscribe</h4>
                    <p>Get 10% off your first order</p>
                    <div className="subscribe-input">
                        <input type="email" placeholder="Enter your email" />
                        <button type="button"><FaPaperPlane /></button>
                    </div>
                </div>
                <div className="footer-column">
                    <h3>Support</h3>
                    <p>111 Bijoy sarani, Dhaka, <br />DH 1515, Bangladesh.</p>
                    <p>exclusive@gmail.com</p>
                    <p>+88015 - 88888-9999</p>
                </div>
                <div className="footer-column">
                    <h3>Account</h3>
                    <ul>
                        <li><a href="#">My Account</a></li>
                        <li><a href="#">Login / Register</a></li>
                        <li><a href="#">Cart</a></li>
                        <li><a href="#">Wishlist</a></li>
                        <li><a href="#">Shop</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Quick link</h3>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms Of Use</a></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                 <div className="footer-column">
                    <h3>Download App</h3>
                    <p>Save $3 with App New User Only</p>
                    <div className="app-buttons">
                
                    </div>
                    <div className="social-icons">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaLinkedinIn /></a>
                    </div>
                </div>
               
            </div>
            <div className="footer-bottom">
                <p>&copy; Copyright Rimet 2022. All right reserved</p>
            </div>
        </footer>
    );
};

export default Footer;