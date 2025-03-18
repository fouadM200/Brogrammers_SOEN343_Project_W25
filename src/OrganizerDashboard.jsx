import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import OrganizerSideMenuBar from "./OrganizerSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

export default function OrganizerDashboard({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  const handleDelete = (eventTitle) => {
    const updatedEvents = events.filter(event => event.title !== eventTitle);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
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
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold">Hello, {user?.name || "-- user first name --"}!</h1>
          <p className="text-gray-600">Welcome to your Dashboard.</p>
          <hr className="my-2 border-gray-300" />
          
          <h2 className="text-2xl font-semibold mt-6">Your Events</h2>
          <hr className="my-2 border-gray-300" />

          {/* Events List */}
          {events.length === 0 ? (
            <p className="text-gray-500">No events created yet.</p>
          ) : (
            <div className="mt-4">
              {events.map((event, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg mb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-gray-500">Speaker: {event.speaker}</p>
                    <p className="text-gray-500">Date: {event.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/edit_event", { state: { event } })}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.title)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
}
