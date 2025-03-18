const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// 1) CREATE EVENT (Organizer only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // authMiddleware attaches `req.user` => { userId: <MongoID> }
    const { userId } = req.user;

    // Find the user
    const organizerUser = await User.findById(userId);
    if (!organizerUser) {
      return res.status(404).json({ error: "Organizer not found" });
    }

    // Check if user is an organizer
    if (organizerUser.role !== "organizer") {
      return res.status(403).json({ error: "Only organizers can create events" });
    }

    // Create the event object from request body
    const newEvent = new Event({
      title: req.body.title,
      speaker: req.body.speaker,
      date: req.body.date,
      startTime: req.body.startTime.trim(),
      endTime: req.body.endTime.trim() || "N/A",
      mode: req.body.mode,
      room: req.body.room,
      location: req.body.location,
      registration: req.body.registration,
      description: req.body.description,
      organizerId: organizerUser._id,
      organizerName: organizerUser.name,
    });

    // Save to DB
    await newEvent.save();
    return res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 2) GET ALL EVENTS (with optional search by title)
router.get("/", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";

    // If searchTerm is present, filter by title
    // Using a case-insensitive regex
    const filter = searchTerm
      ? { title: { $regex: searchTerm, $options: "i" } }
      : {};

    const events = await Event.find(filter).sort({ date: 1 }); // sort by date ascending
    return res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
