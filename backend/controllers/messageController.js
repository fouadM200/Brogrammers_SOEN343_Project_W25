// controllers/messageController.js
const Message = require("../models/Message");

exports.createMessage = async (req, res) => {
  try {
    const { eventId, content } = req.body;
    const userId = req.user.userId; // From authMiddleware
    const message = new Message({ eventId, userId, content });
    await message.save();
    res.status(201).json({ message: "Message saved" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exports;