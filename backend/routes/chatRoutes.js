const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMessages, postMessage, reactToMessage, summarizeMessages } = require("../controllers/chatController");

const router = express.Router();

router.get("/", authMiddleware, getMessages);
router.post("/", authMiddleware, postMessage);
router.post("/react", authMiddleware, reactToMessage);
router.get("/summarize", authMiddleware, summarizeMessages);

module.exports = router;
