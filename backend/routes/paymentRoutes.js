const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", authMiddleware, createPayment);

module.exports = router;
