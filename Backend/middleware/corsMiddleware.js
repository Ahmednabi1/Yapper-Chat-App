const cors = require("cors");

const corsMiddleware = (app) => {
  // Add CORS to the express app
  app.use(
    cors({
      origin: "http://localhost:3000", // React frontend URL
      methods: ["GET", "POST"],
    })
  );
};

module.exports = corsMiddleware;
