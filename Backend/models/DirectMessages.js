const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);
module.exports = DirectMessage;
