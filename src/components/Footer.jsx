import React from 'react';
import '../css/Footer.css';

const Footer = () => (
    <footer className='footer'>
        <div className='footer-content'>
            <div className='footer-col'>
                <h3>Exclusive</h3>
                <p className='footer-subtitle'>Subscribe</p>
                <p className='footer-desc'>Get 10% off your first order</p>
                <form className='footer-form'>
                    <input type='email' placeholder='Enter your email'></input>
                    <button type='submit'>
                        <span>&#8594;</span>
                    </button>
                </form>
            </div>
            <div className='footer-col'>
                <h4>Support</h4>
                <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
                <p>exclusive@gmail.com</p>
                <p>+88015-88888-9999</p>
            </div>
            <div className='footer-col'>
                <h4>Account</h4>
                <p>My Account</p>
                <p>Login / Register</p>
                <p>Cart</p>
                <p>Wishlist</p>
                <p>Shop</p>
            </div>
            <div className='footer-col'>
                <h4>Quick Link</h4>
                <p>Privacy Policy</p>
                <p>Terms Of Use</p>
                <p>FAQ</p>
                <p>Contact</p>
            </div>
            <div className='footer-col'>
                <h4>Download App</h4>
                <p className='footer-app-desc'>Save $3 with App New User Only</p>
                <div className='footer-apps'>
                    <img src="" alt="QR" className="footer-qr" />
                    <div>
                        <img src="" alt="Google Play" className="footer-store" />
                        <img src="" alt="App Store" className="footer-store" />
                    </div>
                </div>
                <div className='footer-socials'>
                    <i className="fab fa-facebook-f"></i>
                    <i className="fab fa-twitter"></i>
                    <i className="fab fa-instagram"></i>
                    <i className="fab fa-linkedin-in"></i>
                </div>
            </div>
        </div>
        <div className='footer-bottom'>
            <span>&copy; Copyright Rimel 2022. All right reserved</span>
        </div>
    </footer>
);

export default Footer;