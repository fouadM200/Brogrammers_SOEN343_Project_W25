import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

const EventDescription = ({ user, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // Extract event and search state from location
  const { event, searchState } = location.state || {};

  // Ensure we get the latest data from localStorage
  const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
  const updatedEvent = storedEvents.find(e => e.title === event?.title) || event;

  console.log("Updated Event:", updatedEvent); // Debugging

  const fallbackEvent = {
    title: "Event Title",
    speaker: "Unknown Speaker",
    date: "Unknown Date",
    time: "Unknown Time",
    mode: "in-person",
    room: "Room 101",
    registration: {
      regular: "Not Set",
      otherStudents: "Not Set",
      concordiaStudents: "Not Set",
    },
    description: "No description available for this event.",
    tags: ["no tags added"] // Fallback tags
  };

  const currentEvent = {
    title: updatedEvent?.title || fallbackEvent.title,
    speaker: updatedEvent?.speaker || fallbackEvent.speaker,
    date: updatedEvent?.date || fallbackEvent.date,
    time: updatedEvent?.startTime
      ? updatedEvent.endTime && updatedEvent.endTime !== "N/A"
        ? `${updatedEvent.startTime} - ${updatedEvent.endTime}`
        : updatedEvent.startTime
      : fallbackEvent.time,
    mode: updatedEvent?.mode || fallbackEvent.mode,
    room: updatedEvent?.room || fallbackEvent.room,
    description: updatedEvent?.description || fallbackEvent.description,
    registration: updatedEvent?.registration || fallbackEvent.registration,
    tags: updatedEvent?.tags || fallbackEvent.tags,
  };

  console.log("Current Event:", currentEvent);

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <UserSideMenuBar user={user} onSignOut={() => setShowConfirm(true)} />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 bg-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Event Details */}
        <div className="p-6 w-full max-w-screen-lg mx-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{currentEvent.title}</h1>
          <hr className="mb-8 border-gray-300 w-full" />
          <p className="text-lg text-gray-700 mb-2">
            <strong>Speaker:</strong> {currentEvent.speaker}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Date:</strong> {currentEvent.date}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Time:</strong> {currentEvent.time}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Mode:</strong> {currentEvent.mode}
          </p>

          {/* Show room number if mode is in-person or hybrid */}
          {(currentEvent.mode === "in-person" || currentEvent.mode === "hybrid") && (
            <p className="text-lg text-gray-700 mb-2">
              <strong>Room:</strong> {currentEvent.room}
            </p>
          )}

          {/* Pricing Info */}
          <p className="text-lg text-gray-700 mb-2">
            <strong>Registration Pricing:</strong>
            <ul className="mt-1 ml-6 list-disc list-inside space-y-1">
              <li>
                <strong>Regular:</strong> {currentEvent.registration?.regular || "Not Set"} $CAD
              </li>
              <li>
                <strong>Other University Students:</strong>{" "}
                <span className="line-through text-gray-500 mr-2">
                  {currentEvent.registration?.regular ? `${currentEvent.registration.regular} $CAD` : "Not Set"}
                </span>
                <span>{currentEvent.registration?.otherStudents || "Not Set"} $CAD</span>
                <span className="text-red-500 font-semibold"> (30% discount)</span>
              </li>
              <li>
                <strong>Concordia Students:</strong>{" "}
                <span className="line-through text-gray-500 mr-2">
                  {currentEvent.registration?.regular ? `${currentEvent.registration.regular} $CAD` : "Not Set"}
                </span>
                <span>{currentEvent.registration?.concordiaStudents || "Not Set"}</span>
              </li>
            </ul>
          </p>

          {/* Description */}
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Event Description</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {currentEvent.description}
          </p>

          {/* Tags */}
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Tags</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {currentEvent.tags.join(", ")}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/search_events", { state: searchState })}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
            >
              Go Back to Search Events
            </button>

            <button
              onClick={() => {
                // Get current user from local storage
                const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

                // Get user's existing registered events
                let userEvents = JSON.parse(localStorage.getItem("userEvents")) || [];

                // Check if the event is already in the user's events
                if (!userEvents.some(e => e.title === currentEvent.title)) {
                  userEvents.push(currentEvent);
                }

                // Save updated events back to local storage
                localStorage.setItem("userEvents", JSON.stringify(userEvents));

                // Navigate to User Dashboard
                navigate("/dashboard");
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
            >
              Register & Pay
            </button>
          </div>
        </div>
      </div>

      {/* Quit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <QuitConfirmation
            onConfirm={() => {
              setShowConfirm(false);
              navigate("/auth"); // Redirect to /auth after confirming logout
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EventDescription;