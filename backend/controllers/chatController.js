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
  
      // Retrieve the current list of users for this emoji using the Map getter
      let reactedUsers = message.reactions.get(emoji) || [];
  
      // Add the reacting user if not already present
      if (!reactedUsers.includes(reactingUser)) {
        reactedUsers.push(reactingUser);
      }
  
      // Update the Map using the setter
      message.reactions.set(emoji, reactedUsers);
      await message.save();
  
      res.json(message);
    } catch (error) {
      console.error("Error updating reaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

  // Add this new function to chatController.js
exports.summarizeMessages = async (req, res) => {
  try {
    const { eventId } = req.query;
    const messages = await ChatMessage.find({ eventId }).sort({ timestamp: 1 });
    if (messages.length === 0) {
      return res.json({ summary: "No messages to summarize." });
    }
    
    // Combine all message texts into one large string.
    let fullText = messages.map((m) => m.text).join(" ");

    // Split the text into sentences (using a regex that looks for punctuation).
    const sentences = fullText.split(/(?<=[.?!])\s+/);
    if (sentences.length <= 3) {
      return res.json({ summary: fullText });
    }

    // Create a basic word frequency map (ignoring some common stopwords).
    const stopWords = new Set([
      "the", "is", "at", "which", "on", "and", "a", "an", "to", "in", "of", "for", "with", "that", "this"
    ]);
    let wordFreq = {};
    const words = fullText.replace(/[^\w\s]/g, "").toLowerCase().split(/\s+/);
    words.forEach((word) => {
      if (!stopWords.has(word) && word.trim() !== "") {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Score each sentence by summing the frequencies of its words.
    let sentenceScores = sentences.map((sentence) => {
      const sentenceWords = sentence.replace(/[^\w\s]/g, "").toLowerCase().split(/\s+/);
      let score = 0;
      sentenceWords.forEach((word) => {
        if (wordFreq[word]) {
          score += wordFreq[word];
        }
      });
      return { sentence, score };
    });

    // Pick the top 3 scoring sentences...
    sentenceScores.sort((a, b) => b.score - a.score);
    const topSentences = sentenceScores.slice(0, 3).map((obj) => obj.sentence);
    // …and then order them in the order they originally appeared.
    topSentences.sort((a, b) => fullText.indexOf(a) - fullText.indexOf(b));

    const summary = topSentences.join(" ");
    return res.json({ summary });
  } catch (error) {
    console.error("Error summarizing messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
