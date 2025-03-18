import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EditEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.event;

  // Ensure event details are properly initialized
  const [eventDetails, setEventDetails] = useState(() => ({
    title: event?.title || "",
    speaker: event?.speaker || "",
    date: event?.date || "",
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    mode: event?.mode || "online",
    room: event?.room || "",
    location: event?.location || "",
    registration: event?.registration || {
      regular: "15.99",
      otherStudents: "11.19",
      concordiaStudents: "Free",
    },
    description: event?.description || "",
  }));

  useEffect(() => {
    if (!event) {
      alert("No event found. Redirecting to dashboard.");
      navigate("/dashboard");
    }
  }, [event, navigate]);

  const handleChange = (e) => {
    setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  };

  const handlePricingChange = (e) => {
    setEventDetails({
      ...eventDetails,
      registration: { ...eventDetails.registration, [e.target.name]: e.target.value },
    });
  };

  const handleSaveChanges = () => {
    if (!eventDetails.title || !eventDetails.date || !eventDetails.startTime || !eventDetails.location) {
      alert("Please fill in all required fields.");
      return;
    }

    let storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const eventIndex = storedEvents.findIndex(e => e.title === event.title);

    if (eventIndex !== -1) {
      storedEvents[eventIndex] = {
        ...storedEvents[eventIndex],
        ...eventDetails, // Ensure all fields are updated
        startTime: eventDetails.startTime.trim(),
        endTime: eventDetails.endTime.trim() || "N/A",
        registration: {
          regular: eventDetails.registration.regular,
          otherStudents: eventDetails.registration.otherStudents,
          concordiaStudents: eventDetails.registration.concordiaStudents
        }
      };

      localStorage.setItem("events", JSON.stringify(storedEvents));
      alert("Event updated successfully!");
      navigate("/dashboard"); // Redirect to dashboard after saving
    } else {
      alert("Event not found.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Title */}
        <input 
          type="text" 
          name="title" 
          placeholder="Event Title" 
          value={eventDetails.title} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-3" 
          required 
        />

        {/* Speaker */}
        <input 
          type="text" 
          name="speaker" 
          placeholder="Speaker Name" 
          value={eventDetails.speaker} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-3" 
          required 
        />

        {/* Date & Time */}
        <input 
          type="date" 
          name="date" 
          value={eventDetails.date} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-3" 
          required 
        />
        <div className="flex gap-2">
          <input 
            type="time" 
            name="startTime" 
            value={eventDetails.startTime} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-3" 
            required 
          />
          <input 
            type="time" 
            name="endTime" 
            value={eventDetails.endTime} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-3" 
          />
        </div>

        {/* Mode Selection */}
        <select 
          name="mode" 
          value={eventDetails.mode} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-3"
        >
          <option value="online">Online</option>
          <option value="in-person">In-Person</option>
          <option value="hybrid">Hybrid</option>
        </select>

        {/* Room (Only if In-Person or Hybrid) */}
        {(eventDetails.mode === "in-person" || eventDetails.mode === "hybrid") && (
          <input 
            type="text" 
            name="room" 
            placeholder="Room Number (If In-Person)" 
            value={eventDetails.room} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-3" 
          />
        )}

        {/* Location */}
        <input 
          type="text" 
          name="location" 
          placeholder="Event Location" 
          value={eventDetails.location} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-3" 
          required 
        />

        {/* Registration Pricing */}
        <div className="border p-3 rounded mb-3">
          <h3 className="font-semibold mb-2">Registration Pricing ($CAD)</h3>
          <div className="flex items-center mb-2">
            <label className="w-1/2">Regular:</label>
            <input 
              type="text" 
              name="regular" 
              value={eventDetails.registration.regular} 
              onChange={handlePricingChange} 
              className="w-1/2 p-2 border rounded"
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-1/2">Other University Students:</label>
            <input 
              type="text" 
              name="otherStudents" 
              value={eventDetails.registration.otherStudents} 
              onChange={handlePricingChange} 
              className="w-1/2 p-2 border rounded"
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/2">Concordia Students:</label>
            <input 
              type="text" 
              name="concordiaStudents" 
              value={eventDetails.registration.concordiaStudents} 
              onChange={handlePricingChange} 
              className="w-1/2 p-2 border rounded"
            />
          </div>
        </div>

        {/* Description */}
        <textarea 
          name="description" 
          placeholder="Event Description" 
          value={eventDetails.description} 
          onChange={handleChange} 
          className="w-full p-2 border rounded mb-3"
        ></textarea>

        {/* Buttons */}
        <button 
          onClick={handleSaveChanges} 
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>

        <button 
          onClick={() => navigate("/dashboard")} 
          className="w-full bg-gray-400 text-white p-2 rounded-md mt-3 hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditEvent;
