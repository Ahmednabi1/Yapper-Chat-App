const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Messages");
//function to generate the access token and the payload is the User email
const generateAccessToken = (Uname) => {
  return jwt.sign({ Uname }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
//register api 
const register = async (req, res) => {
  const { email, password } = req.body; //gets the email and password from the response 

  try {
    let user = await User.findOne({ email }); //check if the email is alreade exists 
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

  //encryption for the password
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ email, password: hashedPassword }); //add new user to database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "no user was found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password doesn't match" });
    }

    //generate the token with the email in the payload
    const token = generateAccessToken(user.email);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const logout = async (req, res) => {
  res.status(200).json({ message: "logged out successfully" });
};


const deleteAccount = async (req, res) => {
  try {
    const userEmail = req.user.Uname;
    const deletedUser = await User.findOneAndDelete({ email: userEmail });
    
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // delete messages sent by user
    await Message.deleteMany({ sender: userEmail });
    
    res.status(200).json({ message: 'Account successfully deleted' });
  } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ message: 'Error deleting account', error });
  }
};

module.exports = { register, login, logout, deleteAccount };
