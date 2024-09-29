require('dotenv').config()
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: 'your-secret-key',
        cookie: {
            secure: false,
        }
    })
)

app.use(passport.initialize());
app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port `);
});

//http://localhost:5000/api/auth/facebook
//http://localhost:5000/api/auth/google