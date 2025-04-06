const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

exports.getMessages = async (req, res) => {
  try {
    const { eventId } = req.query;
    const messages = await ChatMessage.find({ eventId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { eventId, text } = req.body;
    const senderId = req.user.userId;

    // Look up the sender's name
    const user = await User.findById(senderId);
    const senderName = user ? user.name : "Unknown";

    const newMessage = new ChatMessage({
      eventId,
      senderId,
      senderName,
      text,
    });
    await newMessage.save();
    res.status(201).json({ message: "Message sent", chatMessage: newMessage });
  } catch (error) {
    console.error("Error posting chat message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.reactToMessage = async (req, res) => {
    try {
      const { messageId, emoji } = req.body;
      const reactingUser = req.user.name; 
  
      let message = await ChatMessage.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      // Ensure reactions is an object
      if (!message.reactions) {
        message.reactions = {};
      }
  
      // Get the array of users for this emoji, or initialize it
      let reactedUsers = message.reactions[emoji] || [];
  
      if (!reactedUsers.includes(reactingUser)) {
        reactedUsers.push(reactingUser);
      }
  
      message.reactions[emoji] = reactedUsers;
      await message.save();
  
      res.json(message);
    } catch (error) {
      console.error("Error updating reaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };