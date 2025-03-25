const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createPayment, getPaymentDetails } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", authMiddleware, createPayment);
router.get("/", authMiddleware, getPaymentDetails);

module.exports = router;
