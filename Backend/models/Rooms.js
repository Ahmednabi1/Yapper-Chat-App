const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  protection: {
    type: Boolean,
    default: false,
  }, 
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Rooms = mongoose.model("Rooms", RoomSchema);
module.exports = Rooms;
