const express = require("express");
const Room = require("../models/Rooms");
const eventEmitter = require("../controllers/eventsHandling");
//fetching the rooms in database
const fetchRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching rooms" });
  }
};
//creating new room function 
const CreateRoom = async (req, res) => {
  const { roomName, protection, password } = req.body;
  if (!roomName || roomName.trim() === "") {//check if the roomname is empty
    return res.status(400).json({ message: "Room name is required" });
  }
  try {
    const newRoom = new Room({ //add new room to the database 
      roomName,
      protection,
      password: protection ? password : null, // check if room is protected, if not protected password will be null
    });
    await newRoom.save(); // save to database
    eventEmitter.emit("RoomCreated", newRoom); //emit event to roomcontroller to make namespace for the new room
    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error.message);
    res.status(500).json({ message: `error creating room ${error.message}` });
  }
};

module.exports = { fetchRooms, CreateRoom };
