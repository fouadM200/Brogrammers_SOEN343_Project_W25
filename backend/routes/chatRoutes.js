const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMessages, postMessage, reactToMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/", authMiddleware, getMessages);
router.post("/", authMiddleware, postMessage);
router.post("/react", authMiddleware, reactToMessage);

module.exports = router;
