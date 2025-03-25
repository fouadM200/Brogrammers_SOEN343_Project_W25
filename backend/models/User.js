const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["organizer", "attendee", "admin"], default: "attendee" },
  university: { type: String, default: "" },
  interests: { type: [String], default: [] },
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }]
});

module.exports = mongoose.model("User", userSchema);