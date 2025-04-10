const Event = require("../models/Event");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const Message = require("../models/Message");
const Payment = require("../models/Payment");
const mongoose = require("mongoose");

exports.getRegistrationTrends = async (req, res) => {
  try {
    const { eventId } = req.query;
    console.log("Fetching trends for eventId:", eventId);

    const matchStage = eventId ? { eventId: new mongoose.Types.ObjectId(eventId) } : {};
    console.log("Match stage:", matchStage);

    // Check if payments exist for this eventId
    const paymentCheck = await Payment.find(eventId ? { eventId } : {});
    console.log("Payments found:", paymentCheck);

    const trends = await Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
          registrationCount: { $sum: 1 },
          totalRevenue: { $sum: { $toDouble: { $cond: [{ $eq: ["$amount", "Free"] }, 0, "$amount"] } } }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", registrationCount: 1, totalRevenue: 1 } }
    ]);

    const totalPayments = await Payment.countDocuments(matchStage);

    console.log("Trends:", trends);
    console.log("Total Registrations:", totalPayments);

    res.json({
      trends,
      totalRegistrations: totalPayments
    });
  } catch (err) {
    console.error("Error fetching registration trends:", err);
    res.status(500).json({ error: "Failed to fetch registration data" });
  }
};

// Feedback summary and session engagement remain unchanged
exports.getFeedbackSummary = async (req, res) => {
  try {
    const summary = await Feedback.aggregate([
      {
        $group: {
          _id: "$eventId",
          avgRating: { $avg: "$rating" },
          feedbackCount: { $sum: 1 },
        },
      },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback summary" });
  }
};

exports.getSessionEngagement = async (req, res) => {
  try {
    const engagement = await Message.aggregate([
      {
        $group: {
          _id: "$eventId",
          messageCount: { $sum: 1 },
        },
      },
    ]);
    res.json(engagement);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch session engagement" });
  }
};