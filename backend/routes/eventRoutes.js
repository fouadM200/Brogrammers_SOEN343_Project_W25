const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createEvent,
  getEvents,
  getMyEvents,
  deleteEvent,
  registerForEvent,
  leaveEvent
} = require("../controllers/eventController");

const router = express.Router();

router.post("/", authMiddleware, createEvent);
router.get("/", getEvents);
router.get("/my-events", authMiddleware, getMyEvents);
router.delete("/:id", authMiddleware, deleteEvent);
router.post("/register", authMiddleware, registerForEvent);
router.post("/leave", authMiddleware, leaveEvent);

module.exports = router;