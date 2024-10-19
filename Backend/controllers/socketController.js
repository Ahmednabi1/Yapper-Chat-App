const { Server } = require("socket.io");
const express = require("express");
const Room = require("../models/Rooms");
const Message = require('../models/Messages');
const DirectMessage = require('../models/DirectMessages');
const User = require('../models/User');
const jwt = require("jsonwebtoken");


const socketController = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // React frontend URL
      methods: ["GET", "POST"],
    },
  });

  Room.find({}).then((rooms) => {
    rooms.forEach((room) => {
      const ns = io.of("/chat/" + room.roomName);
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
          "a user connected:" +
            `${socket.user.Uname}` +
            ` to : ${room.roomName}`
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
    });
  });

  const directMessageNamespace = io.of('/direct');

  directMessageNamespace.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error("authentication Error"));
    }
  });

  directMessageNamespace.on('connection', (socket) => {
    console.log('User connected for direct messaging:', socket.user.Uname);

    socket.on('direct message', async (data) => {
      const { to, message } = data;

      directMessageNamespace.to(to).emit('direct message', {
        sender: socket.user.Uname,
        message,
      });

      try {
        await DirectMessage.create({
          sender: socket.user.Uname,
          recipient: to,
          message: message,
        });
        console.log('Direct message saved to database');
      } catch (error) {
        console.error("Error saving direct message to MongoDB:", error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from direct messaging:', socket.user.Uname);
    });
  });
};

module.exports = socketController;
