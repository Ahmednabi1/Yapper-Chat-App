import React, { useState } from 'react';
import './LoginForm.css';

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
            // redirect to chat 
        } else {
            setErrorMessage(data.message || 'Login failed');
        }
    }

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                {errorMessage && <div className='message'>{errorMessage}</div>}
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

                <div className='register-link'>
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
