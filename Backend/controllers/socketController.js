const { Server } = require("socket.io");
const express = require("express");
const app = express();
const auth = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const socketController = (server) => {
  // Create a new instance of Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // React frontend URL
      methods: ["GET", "POST"],
    },
  });

  let rooms = ["one", "two", "three"];

  rooms.forEach((room) => {
    const ns = io.of("/chat/" + room);
    ns.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        socket.user = decoded;
        next();
      } catch (err) {
        return next(new Error("authentication Error"));
      }
    });

    ns.on("connection", (socket) => {
      ns.emit("chat message", {
        from: "server",
        message: `${socket.user.Uname} has joined`,
      });
      console.log(
        "a user connected:" + `${socket.user.Uname}` + ` to : ${room}`
      );

      socket.on("chat message", (msg) => {
        let data = {
          from: socket.user.Uname,
          message: msg,
        };
        console.log("message: " + msg + "by: " + socket.user.Uname);
        ns.emit("chat message", data);
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
  });
};

module.exports = socketController;
