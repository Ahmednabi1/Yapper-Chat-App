const { Server } = require("socket.io");
const express = require("express");
const app = express();
const auth = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const Room = require("../models/Rooms");
const Message = require("../models/Messages");
const eventEmitter = require("../controllers/eventsHandling");

const socketController = async (server) => {
  // Create a new instance of Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // React frontend URL
      methods: ["GET", "POST"],
    },
  });
//Function for Creating namespace for the room
  const createnamespace = (room) => {
    const ns = io.of("/chat/" + room.roomName); //namespace is the /chat/roomname
    ns.use((socket, next) => {
      const token = socket.handshake.auth.token; //handshake the token to check it
      if (!token) { //if no token provided
        console.error("Token not provided");
        return next(new Error("Authentication error: Token not provided"));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);// validate the token
        console.log(decoded);
        socket.user = decoded; //make the socket user to be the data of the logeed in user
        next();
      } catch (err) {
        console.error("Token verification failed:", err.message);
        return next(new Error("Authentication error: Invalid token"));
      }
    });

    ns.on("connection", (socket) => { //when connected to the room namespace the user gets a socket  
      ns.emit("chat message", { //server emits that the user joined
        from: "server",
        message: `${socket.user.Uname} has joined`,
      });
      console.log(
        "a user connected:" + `${socket.user.Uname}` + ` to : ${room.roomName}`
      );
      
      socket.on("chat message", async (msg) => { //waiting for the chat message event
        let data = {
          from: socket.user.Uname,
          message: msg,
        };
        console.log("message: " + msg + "by: " + socket.user.Uname);
        ns.emit("chat message", data);

        // save message in database
        try {
          await Message.create({
            chatroom: room._id,
            sender: socket.user.Uname,
            message: msg,
          });
          console.log(msg, " Message saved to MongoDB");
        } catch (error) {
          console.error("Error saving message to MongoDB:", error.message);
        }
      });

      socket.on("disconnect", () => { //when socket disconnects from the namespace
        console.log("user disconnected:", socket.user.Uname);
        ns.emit("chat message", {
          from: "server",
          message: `${socket.user.Uname} has left`,
        });
        delete socket.user.id;
      });
    });
  };

  const rooms = await Room.find(); //retrive the rooms from database 
  rooms.forEach(createnamespace); //create namespace for all rooms in the database

  eventEmitter.on("RoomCreated", (newRoom) => { // wait for the roomcreated event from the roomController
    io.emit("RoomCreated", newRoom); //emeits event to the frontend that a new room created
    createnamespace(newRoom); //create a new namespace for the newroom created
  });
};

module.exports = socketController;
