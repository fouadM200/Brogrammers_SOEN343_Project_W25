const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    amount: { type: String, required: true },
  
    cardHolderName: {
      type: String,
      required: function () {
        return this.amount !== "Free";
      },
    },
    cardLast4: {
      type: String,
      required: function () {
        return this.amount !== "Free";
      },
    },
    expiryDate: {
      type: String,
      required: function () {
        return this.amount !== "Free";
      },
    },
  
    paymentDate: { type: Date, default: Date.now },
    accessCode: { type: String },
    qrCode: { type: String }
  });

module.exports = mongoose.model("Payment", paymentSchema);