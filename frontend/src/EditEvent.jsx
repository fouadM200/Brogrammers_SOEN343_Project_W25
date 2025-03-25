import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OrganizerSideMenuBar from "./OrganizerSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import CancelCreateNewEvent from "./CancelCreateNewEvent";
import SaveChangesSuccess from "./SaveChangesSuccess";

const EditEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const user = location.state?.user;

  const [showCancelOverlay, setShowCancelOverlay] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Initialize eventDetails from the event passed via location.state
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
      regular: "",
      otherStudents: "",
      concordiaStudents: "Free",
    },
    description: event?.description || "",
    tags: event?.tags || [],
  }));

  useEffect(() => {
    if (!event) {
      alert("No event found. Redirecting to dashboard.");
      navigate("/dashboard");
    }
  }, [event, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "regular") {
      const discount = parseFloat(value) * 0.7;
      setEventDetails((prev) => ({
        ...prev,
        registration: {
          ...prev.registration,
          regular: value,
          otherStudents: isNaN(discount) ? "" : discount.toFixed(2),
          concordiaStudents: "Free",
        },
      }));
    } else if (name === "otherStudents" || name === "concordiaStudents") {
      // Prevent manual edits
      return;
    } else if (name in eventDetails.registration) {
      setEventDetails((prev) => ({
        ...prev,
        registration: {
          ...prev.registration,
          [name]: value,
        },
      }));
    } else {
      setEventDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle saving changes by calling the backend update endpoint.
  const handleSaveChanges = async () => {
    const { title, date, startTime, location } = eventDetails;
    if (!title || !date || !startTime || !location) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as an organizer to update an event.");
        return;
      }
      const response = await fetch(`http://localhost:5000/api/events/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(eventDetails),
      });
      if (!response.ok) {
        const errData = await response.json();
        alert(errData.error || "Failed to update event.");
        return;
      }
      setShowSaveSuccess(true);
    } catch (error) {
      console.error("Update event error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <OrganizerSideMenuBar user={user} onSignOut={() => setShowConfirm(true)} />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 bg-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-left mb-2">Edit Event</h1>
          <hr className="border-gray-300 mb-6" />

          <div className="w-full max-w-5xl">
            {/* Title & Speaker */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Event Title:</label>
                <input
                  type="text"
                  name="title"
                  value={eventDetails.title}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Speaker Name:</label>
                <input
                  type="text"
                  name="speaker"
                  value={eventDetails.speaker}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                  required
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Event Date:</label>
                <input
                  type="date"
                  name="date"
                  value={eventDetails.date}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  value={eventDetails.startTime}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  value={eventDetails.endTime}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                />
              </div>
            </div>

            {/* Mode & Location */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Event Mode:</label>
                <select
                  name="mode"
                  value={eventDetails.mode}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                >
                  <option value="online">Online</option>
                  <option value="in-person">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Event Location:</label>
                <input
                  type="text"
                  name="location"
                  value={eventDetails.location}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                  required
                />
              </div>
            </div>

            {/* Room (for in-person/hybrid) */}
            {(eventDetails.mode === "in-person" || eventDetails.mode === "hybrid") && (
              <div className="mb-4">
                <label className="block mb-1 font-medium">Room Number:</label>
                <input
                  type="text"
                  name="room"
                  value={eventDetails.room}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              </div>
            )}

            {/* Registration Pricing */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Registration Pricing ($CAD):</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Regular Attendee:</label>
                  <input
                    type="text"
                    name="regular"
                    value={eventDetails.registration.regular}
                    onChange={handleChange}
                    className="p-3 border rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Other University Students:</label>
                  <input
                    type="text"
                    name="otherStudents"
                    value={eventDetails.registration.otherStudents}
                    readOnly
                    className="p-3 border rounded w-full bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Concordia Students:</label>
                  <input
                    type="text"
                    name="concordiaStudents"
                    value="Free"
                    readOnly
                    className="p-3 border rounded w-full bg-gray-50 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Event Description:</label>
              <textarea
                name="description"
                value={eventDetails.description}
                onChange={handleChange}
                className="w-full h-40 p-3 border rounded"
              ></textarea>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Event Tags (comma-separated):</label>
              <input
                type="text"
                name="tags"
                value={eventDetails.tags.join(", ")}
                onChange={(e) => {
                  const tagsArray = e.target.value.split(",").map(tag => tag.trim());
                  setEventDetails((prev) => ({
                    ...prev,
                    tags: tagsArray,
                  }));
                }}
                className="w-full p-3 border rounded"
                placeholder="e.g., tech, conference, workshop"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelOverlay(true)}
                className="flex-1 bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex-1 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <QuitConfirmation
            onConfirm={() => {
              setShowConfirm(false);
              navigate("/auth");
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}
      {showCancelOverlay && (
        <CancelCreateNewEvent
          onConfirm={() => navigate("/dashboard")}
          onCancel={() => setShowCancelOverlay(false)}
        />
      )}
      {showSaveSuccess && (
        <SaveChangesSuccess
          eventName={eventDetails.title}
          onOk={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
};

export default EditEvent;
