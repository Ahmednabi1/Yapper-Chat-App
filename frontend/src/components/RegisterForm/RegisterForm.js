import React, { useState } from 'react';
import '../LoginForm/LoginForm.css'

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

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
                // redirect to chat aw login
            } else {
                setMessage(data.message || 'Registration failed');
                console.error('Registration failed:', data);
            }
        } catch (error) {
            console.log('Error during registration:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className='wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
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

                {message && <p>{message}</p>}

                <div className='register-link'>
                    <p>Already have an account? <a href="/">Login</a></p>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
