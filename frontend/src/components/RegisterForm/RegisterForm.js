import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginForm/LoginForm.css'
import NavBar from '../NavBar/NavBar';
import leftImage from '../../Assets/Images/yappervectors.png'; // Update the path to your image
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Import icons

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registerData = { email, password };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Registration successful');
                console.log('Registration successful');
                navigate('/login');
            } else {
                setMessage(data.message || 'Registration failed');
                console.error('Registration failed:', data);
            }
        } catch (error) {
            console.log('Error during registration:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/facebook';
    };


    return (
        <div className='LoginPage'>
            <NavBar />
            <div className='content'>
                <img src={leftImage} alt="Description of image" className='left-image' />
                
                <div className='login-box'>
                    <img src={require('../../Assets/Images/YapperLogo.png')} alt="Yapper Logo" className='logo' /> {/* Logo */}
                    <h1>YAPPER</h1>
                    
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

                        <button type="submit">Register</button>

                        <div className='social-login'>
                            <button className='google-button' onClick={handleGoogleLogin}>
                                <FaGoogle className='icon' /> Sign up with Google
                            </button>
                            <button className='facebook-button' onClick={handleFacebookLogin}>
                                <FaFacebook className='icon' /> Sign up with Facebook
                            </button>
                        </div>

                        <div className='register-link'>
                            <p>Already have an account? <a href="/login">Log in</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
