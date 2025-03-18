// src/OrganizerDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrganizerSideMenuBar from "./OrganizerSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import DeleteEvent from "./DeleteEvent";
import EventDeleteSuccess from "./EventDeleteSuccess";

export default function OrganizerDashboard({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // For events data
  const [events, setEvents] = useState([]);

  // For delete modal logic
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const navigate = useNavigate();

  // 1) Fetch "my events" from the backend on mount
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Not logged in, or not an organizer
          return;
        }

        const res = await fetch("http://localhost:5000/api/events/my-events", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          // Could handle errors here
          console.error("Failed to fetch organizer events");
          return;
        }

        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching organizer events:", error);
      }
    };

    fetchMyEvents();
  }, []);

  // 2) Delete an event (optional)
  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("Failed to delete event");
        return;
      }

      // Remove from state
      setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      setShowDeleteSuccess(true);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // 3) Format times (optional)
  const formatTime12Hour = (time24) => {
    if (!time24 || time24 === "N/A") return "N/A";
    const [hour, minute] = time24.split(":");
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
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

          {/* 4) Display the events fetched from the server */}
          {events.length === 0 ? (
            <p className="text-gray-500">No events created yet.</p>
          ) : (
            <div className="mt-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="p-4 bg-white shadow-md rounded-lg mb-3 flex justify-between items-center hover:shadow-lg hover:bg-gray-50 transition duration-200"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-gray-500">Speaker: {event.speaker}</p>
                    <p className="text-gray-500">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">
                      Time: {formatTime12Hour(event.startTime)} - {formatTime12Hour(event.endTime)}
                    </p>
                    <p className="text-gray-500">
                      Mode: {event.mode}{" "}
                      {event.mode !== "online" && event.room ? `| Room: ${event.room}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/edit_event", { state: { event, user } })}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setEventToDelete(event);
                        setShowDeleteModal(true);
                      }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-md"
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
              navigate("/auth");
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <DeleteEvent
          eventName={eventToDelete.title}
          onConfirm={() => {
            handleDelete(eventToDelete._id);
            setShowDeleteModal(false);
          }}
          onCancel={() => {
            setShowDeleteModal(false);
            setEventToDelete(null);
          }}
        />
      )}

      {/* Delete Event Success Overlay */}
      {showDeleteSuccess && eventToDelete && (
        <EventDeleteSuccess
          eventName={eventToDelete.title}
          onOk={() => {
            setShowDeleteSuccess(false);
            setEventToDelete(null);
          }}
        />
      )}
    </div>
  );
}
