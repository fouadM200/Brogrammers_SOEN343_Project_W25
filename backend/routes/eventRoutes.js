const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createEvent,
  getEvents,
  getMyEvents,
  deleteEvent,
  registerForEvent,
  leaveEvent,
  getEventRegistrations,
  updateEvent,  
  submitFeedback,
} = require("../controllers/eventController");

const router = express.Router();

router.post("/", authMiddleware, createEvent);
router.get("/", getEvents);
router.get("/my-events", authMiddleware, getMyEvents);
router.put("/:id", authMiddleware, updateEvent); 
router.delete("/:id", authMiddleware, deleteEvent);
router.post("/register", authMiddleware, registerForEvent);
router.post("/leave", authMiddleware, leaveEvent);
router.get("/registrations/:eventId", authMiddleware, getEventRegistrations);
router.post("/feedback", authMiddleware, submitFeedback);

module.exports = router;
