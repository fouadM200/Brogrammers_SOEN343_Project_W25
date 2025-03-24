const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  regular: { type: String, default: "" },
  otherStudents: { type: String, default: "" },
  concordiaStudents: { type: String, default: "Free" },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  speaker: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, default: "N/A" },
  mode: { type: String, default: "online" },
  room: { type: String, default: "" },
  location: { type: String, required: true },
  registration: { type: registrationSchema, default: {} },
  description: { type: String, default: "" },
  tags: {type: [String], default: ["default test"] },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  organizerName: { type: String, default: "Unknown Organizer" },
});

module.exports = mongoose.model("Event", eventSchema);
