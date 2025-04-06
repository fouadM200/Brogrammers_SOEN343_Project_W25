const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const fetch = require("node-fetch");

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
  
      let reactedUsers = message.reactions.get(emoji) || [];
  
      if (!reactedUsers.includes(reactingUser)) {
        reactedUsers.push(reactingUser);
      }
  
      message.reactions.set(emoji, reactedUsers);
      await message.save();
  
      res.json(message);
    } catch (error) {
      console.error("Error updating reaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
exports.summarizeMessages = async (req, res) => {
    try {
      const { eventId } = req.query;
      if (!eventId) {
        return res.status(400).json({ error: "Missing eventId parameter" });
      }
      const messages = await ChatMessage.find({ eventId }).sort({ timestamp: 1 });
      if (!messages || messages.length === 0) {
        return res.json({ summary: "There are no messages to summarize." });
      }
      const messagesText = messages.map(msg => msg.text).join("\n");
      const prompt = "Summarize the following chat messages:\n" + messagesText;
  
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });
      const data = await aiResponse.json();
      console.log("OpenAI API response:", data);
      const summary = (data.choices && data.choices[0].message && data.choices[0].message.content)
  ? data.choices[0].message.content.trim()
  : "Could not generate a summary.";
      res.json({ summary });
    } catch (error) {
      console.error("Error summarizing messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };