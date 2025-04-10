const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true }, // Like 1–5 stars
  comment: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
