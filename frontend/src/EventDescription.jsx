import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

const EventDescription = ({ user, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // We receive an 'event' object via React Router location state
  const { event } = location.state || {};

  // Fallback event if none is provided
  const fallbackEvent = {
    _id: null,
    title: "Event Title",
    speaker: "Unknown Speaker",
    date: "Unknown Date",
    startTime: "Unknown",
    endTime: "",
    mode: "in-person",
    room: "Room 101",
    registration: {
      regular: "Not Set",
      otherStudents: "Not Set",
      concordiaStudents: "Not Set",
    },
    description: "No description available for this event.",
    tags: ["no tags added"],
  };

  // Merge event data with fallback
  const currentEvent = {
    ...fallbackEvent,
    ...event,
    title: event?.title || fallbackEvent.title,
    speaker: event?.speaker || fallbackEvent.speaker,
    date: event?.date || fallbackEvent.date,
    startTime: event?.startTime || fallbackEvent.startTime,
    endTime: event?.endTime || fallbackEvent.endTime,
    mode: event?.mode || fallbackEvent.mode,
    room: event?.room || fallbackEvent.room,
    description: event?.description || fallbackEvent.description,
    registration: event?.registration || fallbackEvent.registration,
    tags: event?.tags || fallbackEvent.tags,
  };

  // Convert date/time for display
  const displayDate = new Date(currentEvent.date).toLocaleDateString() || "Unknown Date";
  const displayTime = currentEvent.endTime
    ? `${currentEvent.startTime} - ${currentEvent.endTime}`
    : currentEvent.startTime;

  // Handler for registering user for this event
  const handleRegister = async () => {
    try {
      // We need the user's token to authorize the request
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to register for an event.");
        return;
      }

      // Call the backend to register the user for the event
      const response = await fetch("http://localhost:5000/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: currentEvent._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register for event");
      }

      // Optionally show a success message
      alert("Successfully registered for the event!");

      // Navigate to the user dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Error registering for event: " + error.message);
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
            <strong>Date:</strong> {displayDate}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Time:</strong> {displayTime}
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

          {/* Registration Info */}
          <p className="text-lg text-gray-700 mb-2">
            <strong>Registration Pricing:</strong>
            <ul className="mt-1 ml-6 list-disc list-inside space-y-1">
              <li>
                <strong>Regular:</strong>{" "}
                {currentEvent.registration.regular
                  ? `${currentEvent.registration.regular} $CAD`
                  : "Not Set"}
              </li>
              <li>
                <strong>Other University Students:</strong>{" "}
                <span className="line-through text-gray-500 mr-2">
                  {currentEvent.registration.regular
                    ? `${currentEvent.registration.regular} $CAD`
                    : "Not Set"}
                </span>
                <span>
                  {currentEvent.registration.otherStudents
                    ? `${currentEvent.registration.otherStudents} $CAD`
                    : "Not Set"}
                </span>
                <span className="text-red-500 font-semibold"> (30% discount)</span>
              </li>
              <li>
                <strong>Concordia Students:</strong>{" "}
                <span className="line-through text-gray-500 mr-2">
                  {currentEvent.registration.regular
                    ? `${currentEvent.registration.regular} $CAD`
                    : "Not Set"}
                </span>
                <span>
                  {currentEvent.registration.concordiaStudents ||
                    "Not Set"}
                </span>
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
              onClick={() => navigate("/search_events")}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
            >
              Go Back to Search Events
            </button>

            {/* Register & Pay (calls the backend, then navigates to Dashboard) */}
            <button
              onClick={() =>
                navigate("/payment", {
                  state: { event, user },
                })
              }
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
              navigate("/auth");
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EventDescription;
