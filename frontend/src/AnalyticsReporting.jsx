// src/AnalyticsReporting.jsx
import React, { useState, useEffect } from "react";
import SidebarSingleton from "./SidebarSingleton";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import { useNavigate } from "react-router-dom";

export default function AnalyticsReporting({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Get the sidebar instance
  const sidebar = SidebarSingleton.getInstance(user, () => setShowConfirm(true)).getSidebar();

  // Fetch events created by the organizer
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/events/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Failed to fetch events");
          return;
        }
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchMyEvents();
  }, []);

  // Handler when clicking an event to view detailed graphs
  const handleSelectEvent = (event) => {
    navigate(`/organizer/analytics/graph/${event._id}`, { state: { event } });
  };

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {sidebar}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold">Analytics &amp; Reporting</h1>
          <p className="text-gray-600 mt-1">View your event performance data.</p>
          <hr className="my-2 border-gray-300" />

          <section className="bg-white p-4 shadow-md rounded-lg mb-4">
            <h2 className="text-2xl font-semibold">Your Events</h2>
            {events.length === 0 ? (
              <p className="text-gray-500">No events available.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {events.map((event) => (
                  <li
                    key={event._id}
                    onClick={() => handleSelectEvent(event)}
                    className="p-4 bg-gray-50 rounded shadow hover:bg-gray-100 transition cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
}
