// routes/message.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createMessage } = require("../controllers/messageController");

const router = express.Router();

router.post("/", authMiddleware, createMessage);

module.exports = router;