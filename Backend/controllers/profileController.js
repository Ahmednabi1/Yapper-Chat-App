const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await User.findById(req.params.id).select('-password'); 
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { username, email, phone, password, profilePicture } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

   
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.profilePicture = profilePicture || user.profilePicture;

    
    if (password) {
      user.password = password;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
