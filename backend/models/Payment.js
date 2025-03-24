const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  amount: { type: String, required: true }, 
  cardHolderName: { type: String, required: true },
  cardLast4: { type: String, required: true },
  expiryDate: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
