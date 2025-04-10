// SelectChatroom.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

const SelectChatroom = ({ user, onSignOut }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  // Maintain a local state for the user profile (with updated registered events)
  const [profile, setProfile] = useState(user);
  const navigate = useNavigate();

  // Retrieve the sidebar using the updated profile
  const sidebar = SidebarSingleton.getInstance(profile, () => setShowConfirm(true)).getSidebar();

  // Fetch the latest user profile from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile in SelectChatroom:", error);
      }
    };
    fetchProfile();
  }, []);

  // Use the updated registeredEvents from the profile
  const events = profile && profile.registeredEvents ? profile.registeredEvents : [];

  useEffect(() => {
    document.title = "SEES | Select Chatroom";
  }, []);

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {sidebar}
      </div>
      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 bg-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-black">Select a Chatroom</h1>
          <hr className="my-2 border-gray-300" />
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "forwards",
                  animationDuration: "0.5s",
                }}
              >
                <div>
                  <span className="text-xl font-bold">{event.title}</span>
                  <p className="text-gray-600 text-sm">Speaker: {event.speaker}</p>
                </div>
                <button
                  onClick={() => navigate("/chatroom", { state: { event } })}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Access Chatroom
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-md mt-2">No registered events available.</p>
          )}
        </div>
      </div>
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
};

export default SelectChatroom;
