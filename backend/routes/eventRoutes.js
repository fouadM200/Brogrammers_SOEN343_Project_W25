const express = require("express");
const { createEvent, getEvents, getMyEvents, deleteEvent } = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createEvent);
router.get("/", getEvents);
router.get("/my-events", authMiddleware, getMyEvents);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;
