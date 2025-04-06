// Chatroom.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import { SendHorizonal, Smile } from "lucide-react"; // Added Smile for emoji button

const Chatroom = ({ user, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event; // event object passed in from SelectChatroom

  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Track which message (by index) currently has the reaction picker open
  const [activeReactionIndex, setActiveReactionIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // Simple emoji set for both the input emoji picker and the reaction picker
  const emojis = ["😀", "😂", "😍", "👍", "🎉", "😢", "😎", "🙌"];

  // Fetch chat messages
  const fetchMessages = async () => {
    if (!event || !event._id) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/chat?eventId=${event._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      // Ensure each message has a "reactions" property (an object mapping emoji => array of user names)
      const msgs = data.map((msg) => ({
        ...msg,
        reactions: msg.reactions || {},
      }));
      setMessages(msgs);
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

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        // Ensure the new message has a reactions property
        newMessage.chatMessage.reactions = {};
        setMessages((prev) => [...prev, newMessage.chatMessage]);
        setInput("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle reacting to a message by sending the update to the backend
  const handleReact = async (msgIndex, emoji) => {
    const message = messages[msgIndex];
    try {
      const res = await fetch("http://localhost:5000/api/chat/react", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messageId: message._id, emoji }),
      });
      if (res.ok) {
        // Expect the updated message document returned from the backend
        const updatedMessage = await res.json();
        const newMessages = [...messages];
        newMessages[msgIndex] = updatedMessage;
        setMessages(newMessages);
      } else {
        console.error("Failed to update reaction");
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
    setActiveReactionIndex(null);
  };

  // Toggle reaction picker for a specific message
  const toggleReactionPicker = (msgIndex) => {
    setActiveReactionIndex((prevIndex) => (prevIndex === msgIndex ? null : msgIndex));
  };

  // Simple emoji picker for the message input (for adding emojis to input)
  const addInputEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
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

        {/* Header with Back Link and Event Title */}
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
                <strong>Time:</strong> {event.startTime}{" "}
                {event.endTime && `- ${event.endTime}`}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Mode:</strong> {event.mode}
              </p>
              {(event.mode.toLowerCase() === "in-person" ||
                event.mode.toLowerCase() === "hybrid") &&
                event.room && (
                  <p className="text-sm text-gray-700">
                    <strong>Room:</strong> {event.room}
                  </p>
                )}
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 relative">
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            messages.map((msg, index) => {
              const isCurrentUser = msg.senderName === user.name;
              return (
                <div
                  key={index}
                  className={`max-w-md px-4 py-2 shadow-sm relative ${
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
                  {/* Reaction Summary – each emoji displays a tooltip with names */}
                  {msg.reactions &&
                    Object.keys(msg.reactions).length > 0 && (
                      <div className="mt-2 flex space-x-2">
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                          <span
                            key={emoji}
                            title={users.join(", ")}
                            className="inline-flex items-center px-2 py-1 text-xs bg-gray-200 rounded-full"
                          >
                            {emoji} {users.length}
                          </span>
                        ))}
                      </div>
                    )}
                  {/* Reaction Button */}
                  <button
                    onClick={() => toggleReactionPicker(index)}
                    className="absolute bottom-1 right-1 text-xs text-gray-600 hover:text-blue-600"
                    title="React to this message"
                  >
                    😊
                  </button>
                  {/* Reaction Picker for this message */}
                  {activeReactionIndex === index && (
                    <div className="absolute bottom-8 right-0 bg-white border border-gray-200 rounded shadow-lg p-1 flex space-x-1 z-10">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(index, emoji)}
                          className="text-lg hover:scale-110 transition transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Timestamp with conditional color */}
                  <span
                    className={`text-xs ${isCurrentUser ? "text-blue-200" : "text-gray-500"}`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input with Emoji Picker */}
        <div className="p-4 border-t bg-white flex items-center gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border rounded-lg px-4 py-2 outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-600 hover:text-blue-600"
          >
            <Smile className="w-6 h-6" />
          </button>
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-4 bg-white p-2 rounded shadow-lg flex space-x-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addInputEmoji(emoji)}
                  className="text-xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
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

export default Chatroom;
