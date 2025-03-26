import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton"; // New import for singleton
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

const SelectChatroom = ({ user, onSignOut }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Retrieve the sidebar component via the singleton.
  // The onSignOut behavior is set to trigger the logout confirmation.
  const sidebar = SidebarSingleton.getInstance(user, () => setShowConfirm(true)).getSidebar();

  const events = ["Event 1", "Event 2", "Event 3"];
  const speakers = ["Alice Smith", "Bob Johnson", "Charlie Lee"];

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
        className={`flex flex-col flex-1 bg-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-black">Select a Chatroom</h1>
          <hr className="my-2 border-gray-300" />

          {events.map((event, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div>
                <span className="text-xl font-bold">{event}</span>
                <p className="text-gray-600 text-sm">Speaker: {speakers[index]}</p>
              </div>
              <button
                onClick={() => navigate("/chatroom", { state: { eventName: event } })}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Access Chatroom
              </button>
            </div>
          ))}
        </div>
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
};

export default SelectChatroom;
