// src/Chatroom.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton"; // Use singleton instead of direct UserSideMenuBar
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import { SendHorizonal } from "lucide-react";

const Chatroom = ({ user, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventName = location.state?.eventName || "Chatroom";

  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // Load messages from localStorage per event
  const loadMessages = () => {
    const stored = localStorage.getItem(`messages_${eventName}`);
    return stored
      ? JSON.parse(stored)
      : [
          { sender: "Alice", text: "Hey everyone!" },
          { sender: user.name, text: "Hi Alice 👋" },
        ];
  };

  const [messages, setMessages] = useState(loadMessages);

  useEffect(() => {
    localStorage.setItem(`messages_${eventName}`, JSON.stringify(messages));
  }, [messages, eventName]);

  const handleSend = () => {
    if (input.trim() === "") return;
    const updatedMessages = [...messages, { sender: user.name, text: input }];
    setMessages(updatedMessages);
    setInput("");
  };

  // Retrieve the sidebar using the singleton.
  const sidebar = SidebarSingleton.getInstance(user, () => setShowConfirm(true)).getSidebar();

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

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-gray-100">
          <div
            onClick={() => navigate("/select_chatroom")}
            className="cursor-pointer text-sm text-black hover:underline"
          >
            &lt; Go back to Select chatroom
          </div>
          <h2 className="text-xl font-bold text-center flex-1">{eventName}</h2>
          <div className="w-40"></div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.sender === user.name;
            return (
              <div
                key={index}
                className={`max-w-md px-4 py-2 shadow-sm ${
                  isCurrentUser
                    ? "ml-auto bg-blue-500 text-white rounded-2xl rounded-br-none"
                    : "mr-auto bg-gray-300 text-black rounded-2xl rounded-bl-none"
                }`}
              >
                {!isCurrentUser && (
                  <p className="font-semibold text-sm mb-1 text-gray-700">
                    {msg.sender}
                  </p>
                )}
                <p>{msg.text}</p>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border rounded-lg px-4 py-2 outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quit Confirmation Modal */}
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

export default Chatroom;
