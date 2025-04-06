// Chatroom.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import { SendHorizonal } from "lucide-react";

const Chatroom = ({ user, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event; // event object passed in from SelectChatroom

  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    if (!event || !event._id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/chat?eventId=${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [event]);

  const handleSend = async () => {
    if (input.trim() === "") return;
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          text: input,
        }),
      });
      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage.chatMessage]);
        setInput("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <UserSideMenuBar user={user} onSignOut={() => setShowConfirm(true)} />
      </div>
      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 bg-gray-100 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        {/* Header with Back link and Event Title */}
        <div className="flex flex-col border-b border-gray-300 bg-gray-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div
              onClick={() => navigate("/select_chatroom")}
              className="cursor-pointer text-sm text-black hover:underline"
            >
              &lt; Go back to Chatrooms
            </div>
            <h2 className="text-xl font-bold text-center flex-1">
              {event ? event.title : "Chatroom"}
            </h2>
            <div className="w-40"></div>
          </div>
          {/* New Event Info Block */}
          {event && (
            <div className="px-6 py-2 bg-gray-200">
              <p className="text-sm text-gray-700">
                <strong>Speaker:</strong> {event.speaker}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Time:</strong> {event.startTime} {event.endTime && `- ${event.endTime}`}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Mode:</strong> {event.mode}
              </p>
              {(event.mode.toLowerCase() === "in-person" || event.mode.toLowerCase() === "hybrid") && event.room && (
                <p className="text-sm text-gray-700">
                  <strong>Room:</strong> {event.room}
                </p>
              )}
            </div>
          )}
        </div>
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            messages.map((msg, index) => {
              const isCurrentUser = msg.senderName === user.name;
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
                      {msg.senderName}
                    </p>
                  )}
                  <p>{msg.text}</p>
                </div>
              );
            })
          )}
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
