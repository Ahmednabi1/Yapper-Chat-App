const { Server } = require("socket.io");

const socketController = (server) => {
  // Create a new instance of Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // React frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);
    socket.on("create-room", (room, id) => {
      socket.join(room);
      console.log(`Room ${room} was created by socket ${id}`);
      io.to(room).emit("room-created", `room ${room} was created`);
    });

    socket.on("join-room", (room, id) => {
      socket.join(room);
      console.log(`user ${id} has joined room ${room}`);
      io.to(room).emit("join-room", room, id);
    });

    socket.on("chat message", (msg, room, id) => {
      console.log("message: " + msg + "to: " + room + "by: " + socket.id);
      io.to(room).emit("chat message", msg, id);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
};

module.exports = socketController;
