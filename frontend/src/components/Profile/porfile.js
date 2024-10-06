 import "./profile.css"
import React, { useState } from 'react';

const ProfileForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setImage(fileURL);
        }
    };

    const validateUsername = (username) => {
       
        const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
        return regex.test(username);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{8,15}$/;
        return phoneRegex.test(phone);
    };

    const updateProfile = () => {
        setErrorMessage('');
        setSuccessMessage('');

        
        if (!username || !email || !phone || !password || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return;
        }

        if (!validateUsername(username)) {
            setErrorMessage("Username  must contain at least one letter and numbers.");
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (!validatePhone(phone)) {
            setErrorMessage("Phone number must contain 8-15 digits.");
            return;
        }

        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

       
        setSuccessMessage("Profile updated successfully!");

       
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
    };

    return (
        <div className="container">
            <div className="profile-img right">
                <img width="150" alt="Profile" className="profilePictureIcon" src={image || "https://s.gr-assets.com/assets/nophoto/user/u_225x300-c928cbb998d4ac6dd1f0f66f31f74b81.png"} /><br />
                <div className="file">
                    Change Photo
                    <input id="f" type="file" name="file" onChange={handleImageChange} />
                </div>
            </div>
            <div className="Profile-form">
                <form className="row" onSubmit={(e) => { e.preventDefault(); updateProfile(); }}>
                    <div className="input-field">
                        <div className="form-group">
                            <label htmlFor="account-username">Username</label>
                            <input className="form-control" type="text" id="account-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required />
                        </div>
                    </div>
                    <div className="input-field">
                        <div className="form-group">
                            <label htmlFor="account-email">E-mail Address</label>
                            <input className="form-control" type="email" id="account-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Write A Valid Email" required />
                        </div>
                    </div>
                    <div className="input-field">
                        <div className="form-group">
                            <label htmlFor="account-phone">Phone Number</label>
                            <input className="form-control" type="text" id="account-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Write your phone" required />
                        </div>
                    </div>
                    <div className="input-field">
                        <div className="form-group">
                            <label htmlFor="account-pass">New Password</label>
                            <input className="form-control" type="password" id="account-pass" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Write A Complex Password from 8 Letters" required />
                        </div>
                    </div>
                    <div className="input-field">
                        <div className="form-group">
                            <label htmlFor="account-confirm-pass">Confirm Password</label>
                            <input className="form-control" type="password" id="account-confirm-pass" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat the password" required />
                        </div>
                    </div>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    <div className="under-form">
                        <div>
                            <button className="btn-style-1" type="submit">Update Profile</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;