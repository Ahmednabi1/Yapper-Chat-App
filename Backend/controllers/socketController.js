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

  const createnamespace = (room) => {
    const ns = io.of("/chat/" + room.roomName);
    ns.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.error("Token not provided");
        return next(new Error("Authentication error: Token not provided"));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        socket.user = decoded;
        next();
      } catch (err) {
        console.error("Token verification failed:", err.message);
        return next(new Error("Authentication error: Invalid token"));
      }
    });

    ns.on("connection", (socket) => {
      ns.emit("chat message", {
        from: "server",
        message: `${socket.user.Uname} has joined`,
      });
      console.log(
        "a user connected:" + `${socket.user.Uname}` + ` to : ${room.roomName}`
      );

      socket.on("chat message", async (msg) => {
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

      socket.on("disconnect", () => {
        console.log("user disconnected:", socket.user.Uname);
        ns.emit("chat message", {
          from: "server",
          message: `${socket.user.Uname} has left`,
        });
        delete socket.user.id;
      });
    });
  };

  const rooms = await Room.find();
  rooms.forEach(createnamespace);

  eventEmitter.on("RoomCreated", (newRoom) => {
    io.emit("RoomCreated", newRoom);
    createnamespace(newRoom);
  });
};

module.exports = socketController;
