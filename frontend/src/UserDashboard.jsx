// src/UserDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton"; // Use the singleton instead of UserSideMenuBar
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import DisplayAccessCode from "./EventEntryDetails";

export default function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  // 1) Fetch user profile & all events from the backend
  useEffect(() => {
    fetchProfileAndEvents();
  }, []);

  async function fetchProfileAndEvents() {
    try {
      const token = localStorage.getItem("token");

      // Fetch user profile (includes registeredEvents)
      const profileRes = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await profileRes.json();
      setCurrentUser(userData);

      // Fetch all events
      const eventsRes = await fetch("http://localhost:5000/api/events");
      const eventsData = await eventsRes.json();
      setAllEvents(eventsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // 2) Compute upcoming vs recommended events in memory
  const upcomingEvents = allEvents.filter((evt) =>
    currentUser?.registeredEvents?.some(
      (reg) => reg._id.toString() === evt._id.toString()
    )
  );

  const recommendedEvents = allEvents.filter((evt) => {
    // Exclude events the user is already registered for
    const isRegistered = currentUser?.registeredEvents?.some(
      (reg) => reg._id.toString() === evt._id.toString()
    );
    if (isRegistered) return false;

    // Check if the event tags intersect with user interests
    const userInterests = (currentUser?.interests || []).map((i) =>
      i.trim().toLowerCase()
    );
    return evt.tags.some((tag) => userInterests.includes(tag.toLowerCase()));
  });

  // 3) Register for event
  async function handleRegister(eventId) {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });
      // Re-fetch data so UI updates
      await fetchProfileAndEvents();
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  }

  // 4) Leave event
  async function handleLeave(eventId) {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/events/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });
      // Re-fetch data so UI updates
      await fetchProfileAndEvents();
    } catch (error) {
      console.error("Error leaving event:", error);
    }
  }

  // Retrieve the sidebar using the singleton.
  // The onSignOut function here triggers the logout confirmation.
  const sidebar = SidebarSingleton.getInstance(currentUser, () => setShowConfirm(true)).getSidebar();

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
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
          <h1 className="text-3xl font-bold">
            Hello, {currentUser?.name || "User"}!
          </h1>
          <p className="text-gray-600">Welcome to your Dashboard.</p>
          <hr className="my-2 border-gray-300" />

          {/* Upcoming Events Section */}
          <h2 className="text-2xl font-semibold mt-6">Your Upcoming Events</h2>
          <hr className="my-2 border-gray-300" />
          <div className="mt-6 grid grid-cols-1 gap-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <div
                  key={event._id}
                  className="bg-white p-4 shadow-md rounded-md hover:bg-gray-200 transition duration-300 flex justify-between items-center opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "forwards",
                    animationDuration: "0.5s",
                  }}
                >
                  <div>
                    <h4 className="text-lg font-semibold">{event.title}</h4>
                    <p className="text-gray-500">Speaker: {event.speaker}</p>
                    <p className="text-gray-500">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">
                      Time: {event.startTime}{" "}
                      {event.endTime && `- ${event.endTime}`}
                    </p>
                    <p className="text-gray-500">
                      Mode:{" "}
                      {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                      {(event.mode === "in-person" || event.mode === "hybrid") &&
                      event.room
                        ? ` | Room: ${event.room}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowAccessCode(true);
                      }}
                    >
                      Event Entry Details
                    </button>
                    {(event.mode.toLowerCase() === "online" || event.mode.toLowerCase() === "hybrid") && (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={() =>
                          navigate("/online_event_access", {
                            state: { event, user: currentUser },
                          })
                        }
                      >
                        Access Event
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={() => handleLeave(event._id)}
                    >
                      Leave Event
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events registered.</p>
            )}
          </div>

          {/* Events You Might Be Interested In */}
          <h2 className="text-2xl font-semibold mt-6">
            Events You Might Be Interested In
          </h2>
          <hr className="my-2 border-gray-300" />
          <div className="mt-6 grid grid-cols-1 gap-4">
            {recommendedEvents.length > 0 ? (
              recommendedEvents.map((event, index) => (
                <div
                  key={event._id}
                  className="bg-white p-6 shadow-md rounded-lg transition duration-300 hover:bg-gray-100 flex justify-between items-center opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "forwards",
                    animationDuration: "0.5s",
                  }}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-gray-500">Speaker: {event.speaker}</p>
                    <p className="text-gray-500">
                      Date: {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">
                      Time:{" "}
                      {new Date(`1970-01-01T${event.startTime}`).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                      -{" "}
                      {new Date(`1970-01-01T${event.endTime}`).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-gray-500">
                      Mode:{" "}
                      {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                      {(event.mode === "in-person" || event.mode === "hybrid") &&
                      event.room
                        ? ` | Room: ${event.room}`
                        : ""}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate("/event_description", { state: { event } })
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events match your interests.</p>
            )}
          </div>
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

      {/* Access Code Overlay */}
      {showAccessCode && selectedEvent && currentUser && (
        <DisplayAccessCode
          event={selectedEvent}
          user={currentUser}
          onOk={() => setShowAccessCode(false)}
        />
      )}
    </div>
  );
}
