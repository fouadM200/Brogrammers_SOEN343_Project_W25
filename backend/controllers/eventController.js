const Event = require("../models/Event");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Notifier = require("../utils/notifier"); 
const EmailNotifier = require("../utils/emailNotifier"); 
const Feedback = require("../models/Feedback");
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

    const interestedUsers = await User.find({
      interests: { $in: newEvent.tags }
    });

    // Set up the notifier
    const notifier = new Notifier();
    const emailNotifier = new EmailNotifier();
    notifier.subscribe(emailNotifier);

    // Notify all observers (in this case, just EmailNotifier)
    await notifier.notify({ newEvent, interestedUsers });

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

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user; 

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.organizerId.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to update this event" });
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
    console.error("Update event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { userId } = req.user; // From authMiddleware
    const { eventId, rating } = req.body;

    // Validate input
    if (!eventId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Event ID and rating (1-5) are required" });
    }

    // Check if user is registered for the event
    const user = await User.findById(userId);
    if (!user || !user.registeredEvents.includes(eventId)) {
      return res.status(403).json({ error: "You are not registered for this event" });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ userId, eventId });
    if (existingFeedback) {
      return res.status(400).json({ error: "Feedback already submitted for this event" });
    }

    // Save feedback
    const feedback = new Feedback({
      eventId,
      userId,
      rating,
    });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};