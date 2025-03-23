import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import DisplayAccessCode from "./EventEntryDetails";

export default function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const events = [
    {
      name: "Upcoming Event 1",
      speaker: "John Doe",
      date: "March 10, 2025",
      time: "2:00 PM - 4:00 PM"
    },
    {
      name: "Upcoming Event 2",
      speaker: "Jane Smith",
      date: "March 15, 2025",
      time: "10:00 AM - 12:00 PM"
    }
  ];

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <UserSideMenuBar user={currentUser} onSignOut={() => setShowConfirm(true)} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold">Hello, {currentUser?.name || "User"}!</h1>
          <p className="text-gray-600">Welcome to your Dashboard.</p>
          <hr className="my-2 border-gray-300" />

          <h2 className="text-2xl font-semibold mt-6">Your Upcoming Events</h2>
          <hr className="my-2 border-gray-300" />

          {/* Upcoming Events Section */}
          <div className="mt-6 grid grid-cols-1 gap-4">
            {events.map((event, index) => (
              <div
                key={event.name}
                className="bg-white p-4 shadow-md rounded-md hover:bg-gray-200 transition duration-300 flex justify-between items-center opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "forwards",
                  animationDuration: "0.5s"
                }}
              >
                <div>
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-gray-500">Speaker: {event.speaker}</p>
                  <p className="text-gray-500">Date: {event.date}</p>
                  <p className="text-gray-500">Time: {event.time}</p>
                </div>
                <div className="flex flex-col gap-2 ml-6">
                  <button
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                    onClick={() => {
                      setSelectedEventName(event.name);
                      setShowAccessCode(true);
                    }}
                  >
                    Event Entry Details
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() =>
                      navigate("/online_event_access", {
                        state: {
                          eventName: event.name,
                          user: currentUser
                        }
                      })
                    }
                  >
                    Access Event
                  </button>
                </div>
              </div>
            ))}
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
      {showAccessCode && (
        <DisplayAccessCode
          eventName={selectedEventName}
          onOk={() => setShowAccessCode(false)}
        />
      )}
    </div>
  );
}
