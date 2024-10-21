const Message = require("../models/Messages");
//getting messages from the database 
const getMessages = async (req, res) => {
    const roomId = req.params.roomId;

    try {
        const messages = await Message.find({ chatroom: roomId }) //find the messages from the database where chatroom = roomid
        res.json(messages); //return the messages in the response

    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error', error: error});
    }
  };
  
  module.exports = { getMessages };
  
