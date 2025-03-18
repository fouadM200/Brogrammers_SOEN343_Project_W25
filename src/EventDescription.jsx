// ✅ EventDescription.jsx (Preserves search state and shows long fallback description if needed)
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

  const fallbackEvent = {
    title: "Event Title",
    speaker: "Unknown Speaker",
    date: "Unknown Date",
    time: "Unknown Time",
    mode: "in-person",
    room: "Room 101",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
      "Sed euismod, neque in vestibulum feugiat, metus arcu egestas augue, " +
      "ac fermentum turpis nisi nec augue. Morbi hendrerit, elit a suscipit porttitor, " +
      "libero nulla facilisis lacus, nec malesuada purus nisl sed nisi. " +
      "Quisque viverra, est a dignissim fermentum, velit nunc bibendum lorem, " +
      "at convallis mauris libero ut turpis. Pellentesque habitant morbi tristique senectus " +
      "et netus et malesuada fames ac turpis egestas. Aenean posuere, enim vitae luctus bibendum, " +
      "orci metus gravida nulla, ut interdum nulla ligula sed risus."
  };

  const currentEvent = {
    title: event?.title || fallbackEvent.title,
    speaker: event?.speaker || fallbackEvent.speaker,
    date: event?.date || fallbackEvent.date,
    time: event?.time || fallbackEvent.time,
    mode: event?.mode || fallbackEvent.mode,
    room: event?.room || fallbackEvent.room,
    description:
      event?.description && event.description.length > 100
        ? event.description
        : fallbackEvent.description
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
                <strong>Regular:</strong> 15.99 $CAD
              </li>
              <li>
                <strong>Other University Students:</strong>{" "}
                <span className="line-through text-gray-500 mr-2">15.99 $CAD</span>
                <span>11.19 $CAD </span>
                <span className="text-red-500 font-semibold">(30% discount)</span>
              </li>
              <li>
                <strong>Concordia Students:</strong>{" "}
                <span className="line-through text-gray-500 mr-2">15.99 $CAD</span>
                <span>Free</span>
              </li>
            </ul>
          </p>

          {/* Description */}
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Event Description</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {currentEvent.description}
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
              onClick={() => alert("Registration feature coming soon! 😉")}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
            >
              Register
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
              onSignOut();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EventDescription;
