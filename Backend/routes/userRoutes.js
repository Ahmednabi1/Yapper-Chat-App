const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authentication = require('../middleware/authMiddleware');

router.get('/users',authentication, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching usersss" });
  }
});

module.exports = router;
