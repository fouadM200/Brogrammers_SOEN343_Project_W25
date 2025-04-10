const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/registrations", authMiddleware, analyticsController.getRegistrationTrends);
router.get("/feedback", authMiddleware, analyticsController.getFeedbackSummary);
router.get("/engagement", authMiddleware, analyticsController.getSessionEngagement);

module.exports = router;