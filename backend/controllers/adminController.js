const Event = require("../models/Event");
const User = require("../models/User");
const Payment = require("../models/Payment");

// EVENTS
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error("Admin get events error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    event.title = req.body.title || event.title;
    event.speaker = req.body.speaker || event.speaker;
    event.date = req.body.date || event.date;
    event.startTime = req.body.startTime || event.startTime;
    event.endTime = req.body.endTime || event.endTime;
    event.mode = req.body.mode || event.mode;
    event.room = req.body.room || event.room;
    event.location = req.body.location || event.location;
    event.zoomLink = req.body.zoomLink || event.zoomLink; 
    event.registration = req.body.registration || event.registration;
    event.description = req.body.description || event.description;
    event.tags = req.body.tags || event.tags;
    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Admin update event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Admin delete event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.university = req.body.university || user.university;
    user.interests = req.body.interests || user.interests;
    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Admin update user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PAYMENTS
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Admin get payments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await Payment.findByIdAndDelete(id);
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Admin delete payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
