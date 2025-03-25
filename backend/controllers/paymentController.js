const Payment = require("../models/Payment");
const User = require("../models/User");
const Event = require("../models/Event");

// Helper function to generate an 8-character unique code
function generateUniqueCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

exports.createPayment = async (req, res) => {
  try {
    const { userId } = req.user;
    const { eventId, amount, cardHolderName, cardNumber, expiryDate, cvv } = req.body;
    
    // Validate required fields
    if (!eventId || !amount || !cardHolderName || !cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ error: "Missing payment information." });
    }
    
    const cardLast4 = cardNumber.slice(-4);
    
    // Generate unique codes for access (online) and QR (in-person)
    const accessCode = generateUniqueCode();
    const qrCode = generateUniqueCode();
    
    const newPayment = new Payment({
      userId,
      eventId,
      amount,
      cardHolderName,
      cardLast4,
      expiryDate,
      accessCode,
      qrCode
    });
    
    await newPayment.save();
    res.status(201).json({ message: "Payment processed successfully.", payment: newPayment });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// GET endpoint to fetch payment details by eventId and userId
exports.getPaymentDetails = async (req, res) => {
  try {
    const { eventId, userId } = req.query;
    const payments = await Payment.find({ eventId, userId });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
