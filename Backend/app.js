require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/database");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const messageRoutes = require('./routes/messages'); 
const socketController = require("./controllers/socketController");
const corsMiddleware = require("./middleware/corsMiddleware");
const profileController = require("./controllers/profileController");
const profileRoutes = require('./routes/profile'); 




dotenv.config();
const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());

app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "your-secret-key",
    cookie: {
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api", roomRoutes);
app.use("/api", messageRoutes);
app.use('/api/profile', profileRoutes);

app.get("");

socketController(server);
corsMiddleware(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//http://localhost:5000/api/auth/facebook
//http://localhost:5000/api/auth/google
