const express = require("express");
const Room = require("../models/Rooms");
 
const fetchRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching rooms" });
  }
};

const CreateRoom = async (req, res) => {
  const { roomName, protection, password } = req.body;
  if (!roomName || roomName.trim() === "") {
    return res.status(400).json({ message: "Room name is required" });
  }
  try {
    const newRoom = new Room({
      roomName,
      protection,
      password: protection ? password : null,
    });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error.message);
    res.status(500).json({ message: `error creating room ${error.message}` });
  }
};

module.exports = { fetchRooms, CreateRoom };
