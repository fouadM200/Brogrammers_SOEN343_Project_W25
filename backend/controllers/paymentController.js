const Payment = require("../models/Payment");
const User = require("../models/User");
const Event = require("../models/Event");

// Controller function to create a payment record
exports.createPayment = async (req, res) => {
  try {
    // Get the authenticated user's ID from req.user (set by authMiddleware)
    const { userId } = req.user;
    const { eventId, amount, cardHolderName, cardNumber, expiryDate, cvv } = req.body;

    // Validate required fields
    if (!eventId || !amount || !cardHolderName || !cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ error: "Missing payment information." });
    }


    const cardLast4 = cardNumber.slice(-4);

    // Create a new Payment record
    const newPayment = new Payment({
      userId,
      eventId,
      amount,
      cardHolderName,
      cardLast4,
      expiryDate
    });

    // Save the payment record to the database
    await newPayment.save();

    // Return success message and the payment record
    res.status(201).json({ message: "Payment processed successfully.", payment: newPayment });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
