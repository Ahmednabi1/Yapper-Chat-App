const Message = require("../models/Messages");

const getMessages = async (req, res) => {
    const roomId = req.params.roomId;

    try {
        const messages = await Message.find({ chatroom: roomId })
        res.json(messages);

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error', error: error});
    }
  };
  
  module.exports = { getMessages };
  