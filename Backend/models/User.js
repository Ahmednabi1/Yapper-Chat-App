const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    googleId: { type: String }, 
    facebookId: { type: String }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
