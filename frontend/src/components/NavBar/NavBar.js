import React from 'react';
import './NavBar.css';
import { useLocation } from 'react-router-dom';
import logo from '../../Assets/Images/YapperLogo.png'; // Adjust the path if necessary

function NavBar() { 
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Yapper Logo" className="logo-img" />
                <h1>YAPPER</h1>
            </div>
            <ul className="navbar-links">
                <li><a href="#about">About</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#contact">Contact</a></li>
                <li>
                    <a href={isLoginPage ? "/register" : "/login"} className="login-btn">
                        {isLoginPage ? "Register" : "Log in"}
                    </a>
                </li>

            </ul>
        </nav>
    );
}

export default NavBar;
