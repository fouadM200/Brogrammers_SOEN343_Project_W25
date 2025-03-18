// ✅ SearchEvents.jsx (UPDATED to preserve search term and results)
import React, { useState, useEffect } from "react";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchEvents = ({ user, onSignOut }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Restore previous state from location
  const { previousSearchTerm = "", previousSearchTriggered = false } = location.state || {};

  const [searchTerm, setSearchTerm] = useState(previousSearchTerm);
  const [searchTriggered, setSearchTriggered] = useState(previousSearchTriggered);

  const suggestedEvents = [
    {
      title: "Tech Conference 2025",
      speaker: "Jane Smith",
      date: "March 20, 2025",
      time: "9:00 AM - 1:00 PM"
    },
    {
      title: "Startup Pitch Day",
      speaker: "Mark Johnson",
      date: "April 2, 2025",
      time: "11:00 AM - 3:00 PM"
    },
    {
      title: "Design Bootcamp",
      speaker: "Emily Wong",
      date: "May 10, 2025",
      time: "10:00 AM - 2:00 PM"
    }
  ];

  const aiEvents = [
    {
      title: "AI in Education",
      speaker: "Dr. Amina Karim",
      date: "May 5, 2025",
      time: "1:00 PM - 4:00 PM"
    },
    {
      title: "Future of AI",
      speaker: "Alex Chen",
      date: "June 12, 2025",
      time: "3:00 PM - 6:00 PM"
    },
    {
      title: "Ethics in AI",
      speaker: "Nina Patel",
      date: "July 8, 2025",
      time: "2:00 PM - 5:00 PM"
    }
  ];

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  const isAIQuery = searchTerm.trim().toLowerCase() === "ai";
  const noResults = searchTriggered && !isAIQuery && searchTerm.trim().length > 0;

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <UserSideMenuBar user={user} onSignOut={() => setShowConfirm(true)} />
      </div>

      <div
        className={`flex flex-col flex-1 bg-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white shadow-md rounded-lg px-4 py-2 w-full">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchTriggered(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for events..."
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
            >
              Search
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-black">
              {searchTriggered ? "Search Results" : "Suggested Events"}
            </h2>
            <hr className="my-2 border-gray-300" />

            <div className="grid grid-cols-1 gap-4">
              {searchTriggered ? (
                isAIQuery ? (
                  aiEvents.map((event, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 shadow-md rounded-lg transition-all duration-500 ease-out transform opacity-0 animate-fade-in"
                      style={{
                        animationDelay: `${index * 200}ms`,
                        animationFillMode: "forwards",
                        animationDuration: "0.5s"
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-gray-500">Speaker: {event.speaker}</p>
                          <p className="text-gray-500">Date: {event.date}</p>
                          <p className="text-gray-500">Time: {event.time}</p>
                        </div>
                        <button
                          onClick={() =>
                            navigate("/event_description", {
                              state: {
                                event: {
                                  title: event.title,
                                  speaker: event.speaker,
                                  date: event.date,
                                  time: event.time,
                                  mode: event.mode || "Online",
                                  room: event.room || "N/A",
                                  description:
                                    event.description ||
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                },
                                searchState: {
                                  previousSearchTerm: searchTerm,
                                  previousSearchTriggered: true
                                }
                              }
                            })
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                          Select Event
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  noResults && (
                    <p className="text-gray-500 text-md mt-2">No events found.</p>
                  )
                )
              ) : (
                suggestedEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 shadow-md rounded-lg transition duration-300 hover:bg-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-gray-500">Speaker: {event.speaker}</p>
                      <p className="text-gray-500">Date: {event.date}</p>
                      <p className="text-gray-500">Time: {event.time}</p>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/event_description", {
                          state: {
                            event: {
                              title: event.title,
                              speaker: event.speaker,
                              date: event.date,
                              time: event.time,
                              mode: event.mode || "Online",
                              room: event.room || "N/A",
                              description:
                                event.description ||
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                            },
                            searchState: {
                              previousSearchTerm: searchTerm,
                              previousSearchTriggered: searchTriggered
                            }
                          }
                        })
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Select Event
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

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

export default SearchEvents;