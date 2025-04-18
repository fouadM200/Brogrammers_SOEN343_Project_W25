const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reactions: {
    type: Map,
    of: [String],
    default: {}
  }
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
