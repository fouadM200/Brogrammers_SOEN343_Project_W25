import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

export default function AnalyticsReporting({ user }) {
  const [events, setEvents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const eventsRes = await fetch("http://localhost:5000/api/events/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!eventsRes.ok) {
          console.error(`Failed to fetch events: ${eventsRes.status} ${eventsRes.statusText}`);
          return;
        }
        const eventsData = await eventsRes.json();
        console.log("Fetched events:", eventsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    };

    fetchMyEvents();
  }, []);

  const handleSelectEvent = (event) => {
    navigate(`/organizer/analytics/graph/${event._id}`, { state: { event } });
  };

  const sidebar = SidebarSingleton.getInstance(user, () => setShowConfirm(true)).getSidebar();

  // Helper function to check if a date is valid
  const isValidDate = (date) => {
    return date && !isNaN(new Date(date).getTime());
  };

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {sidebar}
      </div>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

          <section className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Your Events</h2>
            {events.length > 0 ? (
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event._id} className="border p-4 rounded-lg">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    {isValidDate(event.startDate) && isValidDate(event.endDate) && (
                      <p className="text-gray-600">
                        Date: {new Date(event.startDate).toLocaleDateString()} -{" "}
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      onClick={() => handleSelectEvent(event)}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                    >
                      View Analytics
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              "No events found."
            )}
          </section>
        </main>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <QuitConfirmation
            onConfirm={() => {
              setShowConfirm(false);
              window.location.href = "/auth";
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}
    </div>
  );
}