const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMessages, postMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/", authMiddleware, getMessages);
router.post("/", authMiddleware, postMessage);

module.exports = router;
