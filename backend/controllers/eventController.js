const Event = require("../models/Event");
const User = require("../models/User");
const Payment = require("../models/Payment");

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { userId } = req.user;

    const organizerUser = await User.findById(userId);
    if (!organizerUser || organizerUser.role !== "organizer") {
      return res.status(403).json({ error: "Only organizers can create events" });
    }

    const newEvent = new Event({
      ...req.body,
      organizerId: userId,
      organizerName: organizerUser.name,
    });

    await newEvent.save();
    return res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all events (optional search by title)
exports.getEvents = async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const filter = searchTerm
      ? { title: { $regex: searchTerm, $options: "i" } }
      : {};

    const events = await Event.find(filter).sort({ date: 1 });
    return res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get events created by the logged-in organizer
exports.getMyEvents = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user || user.role !== "organizer") {
      return res.status(403).json({ error: "Only organizers can view their events" });
    }

    const events = await Event.find({ organizerId: userId }).sort({ date: 1 });
    return res.json(events);
  } catch (error) {
    console.error("Get my events error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { userId } = req.user;
    const event = await Event.findById(req.params.id);

    if (!event || event.organizerId.toString() !== userId) {
      return res.status(403).json({ error: "You cannot delete this event" });
    }

    await event.deleteOne();
    return res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.registerForEvent = async (req, res) => {
  try {
    const { userId } = req.user;    // from authMiddleware (decoded token)
    const { eventId } = req.body;   // pass in { eventId } in the request body

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If not already registered, push it
    if (!user.registeredEvents.includes(eventId)) {
      user.registeredEvents.push(eventId);
      await user.save();
    }

    res.json({ message: "Registered for event successfully" });
  } catch (error) {
    console.error("Register for event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Leave (unregister from) an event
exports.leaveEvent = async (req, res) => {
  try {
    const { userId } = req.user;
    const { eventId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove event from user's registeredEvents array
    user.registeredEvents = user.registeredEvents.filter(
      (id) => id.toString() !== eventId
    );
    await user.save();

    res.json({ message: "Left event successfully" });
  } catch (error) {
    console.error("Leave event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get registrations (with payment details) for a specific event
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Find all payment records for the given eventId and populate the user details
    const payments = await Payment.find({ eventId }).populate({
      path: "userId",
      select: "name email"
    });
    // Return the payment records
    res.json(payments);
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};