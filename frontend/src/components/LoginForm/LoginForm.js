import React, { useState } from 'react';
import './LoginForm.css';
import NavBar from '../NavBar/NavBar';
import leftImage from '../../Assets/Images/yappervectors.png'; // Update the path to your image
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Import icons

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = { email, password };

        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            console.log('Login successful');
            // Redirect to chat
        } else {
            setErrorMessage(data.message || 'Login failed');
        }
    }

    return (
        <div className='LoginPage'>
            <NavBar />
            <div className='content'>
                <img src={leftImage} alt="Description of image" className='left-image' />
                
                <div className='login-box'>
                    <img src={require('../../Assets/Images/YapperLogo.png')} alt="Yapper Logo" className='logo' /> {/* Logo */}
                    <h1>YAPPER</h1>
                    {errorMessage && <div className='message'>{errorMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className='input-box'>
                            <input 
                                type="text" 
                                placeholder="Email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='input-box'>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit">Login</button>

                        <div className='social-login'>
                            <button className='google-button'>
                                <FaGoogle className='icon' /> Log in with Google
                            </button>
                            <button className='facebook-button'>
                                <FaFacebook className='icon' /> Log in with Facebook
                            </button>
                        </div>

                        <div className='register-link'>
                            <p>Don't have an account? <a href="/register">Register</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
