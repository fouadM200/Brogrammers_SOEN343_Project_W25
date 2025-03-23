import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import AccessEventSuccess from "./AccessEventSuccess";
import AccessEventFailed from "./AccessEventFailed";
import { ClipboardPaste } from "lucide-react";

export default function OnlineEventAccess() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { eventName, user } = location.state || {};

  const correctCode = "ABCD1234"; // ✅ Hardcoded valid code for now

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setAccessCode(clipboardText);
    } catch (err) {
      alert("Failed to read from clipboard.");
    }
  };

  const handleAccess = () => {
    if (accessCode.trim().toUpperCase() === correctCode) {
      setShowSuccess(true);
    } else {
      setShowFailure(true);
    }
  };

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <UserSideMenuBar user={user} onSignOut={() => navigate("/auth")} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold text-left mb-1">{eventName || "Online Event"}</h1>
          <hr className="mb-6 border-gray-300" />

          <p className="text-lg font-medium text-gray-700 mb-4">
            Insert your access code for <strong>{eventName}</strong> event:
          </p>

          <div className="relative mb-6 max-w-md">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="e.g. ABCD1234"
              className="w-full p-3 pr-12 border rounded-md text-gray-700"
            />
            <button
              onClick={handlePaste}
              className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-blue-600"
              title="Paste from clipboard"
            >
              <ClipboardPaste size={20} />
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard", { state: { user } })}
              className="bg-gray-800 text-white py-3 px-6 rounded-md hover:bg-gray-900"
            >
              Go Back to Dashboard
            </button>
            <button
              onClick={handleAccess}
              className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
            >
              Access Event
            </button>
          </div>
        </main>
      </div>

      {/* ✅ Success Overlay */}
      {showSuccess && (
        <AccessEventSuccess onOk={() => setShowSuccess(false)} />
      )}

      {/* ❌ Failure Overlay */}
      {showFailure && (
        <AccessEventFailed
          eventName={eventName}
          onOk={() => setShowFailure(false)}
        />
      )}
    </div>
  );
}
