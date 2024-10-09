const express = require("express");
const { fetchRooms, CreateRoom } = require("../controllers/roomsController");
const router = express.Router();

router.get("/rooms", fetchRooms);
router.post("/rooms/createroom", CreateRoom);

module.exports = router;
