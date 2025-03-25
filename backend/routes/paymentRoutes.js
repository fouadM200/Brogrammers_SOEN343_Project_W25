const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createPayment, getPaymentDetails, createFreePayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", authMiddleware, createPayment);
router.get("/", authMiddleware, getPaymentDetails);
router.post("/free", authMiddleware, createFreePayment);

module.exports = router;
