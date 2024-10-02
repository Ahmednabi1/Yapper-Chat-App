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

    // Listen for 'chat message' events
    socket.on("chat message", (msg) => {
      console.log("message: " + msg);

      // Broadcast the message to all connected clients
      io.emit("chat message", msg);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
};

module.exports = socketController;
