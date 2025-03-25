const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllEvents,
  updateEvent,
  deleteEvent,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllPayments,
  deletePayment,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/events", authMiddleware, adminMiddleware, getAllEvents);
router.put("/events/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/events/:id", authMiddleware, adminMiddleware, deleteEvent);

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.put("/users/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

router.get("/payments", authMiddleware, adminMiddleware, getAllPayments);
router.delete("/payments/:id", authMiddleware, adminMiddleware, deletePayment);

module.exports = router;