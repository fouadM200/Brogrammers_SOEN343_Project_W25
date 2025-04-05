// src/Profile.jsx
import HeaderMenuBar from "./HeaderMenuBar";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton";

// Define default interest domains
const defaultDomains = ["Technology", "Sports", "Art", "Science", "Literature"];

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
      setInterests(user.interests || []);
    }
  }, []);

  const updateUserInterests = async (updatedInterests) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");
      const response = await fetch("http://localhost:5000/api/auth/update-interests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: currentUser.email,
          interests: updatedInterests,
        }),
      });
      if (!response.ok) throw new Error("Failed to update interests");
      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating interests:", error);
      alert("Failed to update interests. Please try again.");
    }
  };

  const handleAddInterest = async () => {
    if (newInterest.trim() !== "") {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      setNewInterest("");
      await updateUserInterests(updatedInterests);
    }
  };

  const handleRemoveInterest = async (interest) => {
    const updatedInterests = interests.filter((i) => i !== interest);
    setInterests(updatedInterests);
    await updateUserInterests(updatedInterests);
  };

  // Toggle bubble selection: if domain is selected, remove it; otherwise, add it.
  const toggleDomain = async (domain) => {
    let updatedInterests;
    if (interests.includes(domain)) {
      updatedInterests = interests.filter((i) => i !== domain);
    } else {
      updatedInterests = [...interests, domain];
    }
    setInterests(updatedInterests);
    await updateUserInterests(updatedInterests);
  };

  // Toggle function to show/hide sidebar.
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Retrieve the sidebar component via the singleton.
  const sidebar = SidebarSingleton.getInstance(currentUser, () => navigate("/auth")).getSidebar();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 bg-gray-800 text-white transition-all duration-300">
          {sidebar}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <HeaderMenuBar toggleSidebar={toggleSidebar} />

        {/* Full Page Profile Content */}
        <div className="p-8">
          {currentUser ? (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Revised Profile Header matching sidebar blue */}
              <div className="bg-blue-600 rounded-xl shadow p-6 flex flex-col md:flex-row items-center transition-transform transform hover:scale-105">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-3xl mr-4 shadow">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                {/* Name and University */}
                <div className="text-white text-center md:text-left">
                  <h1 className="text-3xl font-bold tracking-normal">{currentUser.name}</h1>
                  <div className="w-full h-1 mt-1 mb-2 bg-gradient-to-r from-blue-300 to-blue-800 rounded"></div>
                  <p className="text-base italic">
                    {currentUser.university || "University not specified"}
                  </p>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold border-b pb-2 text-gray-800">
                  Contact Info
                </h2>
                <ul className="mt-2 text-gray-600 space-y-1">
                  <li>
                    <strong>Email:</strong> {currentUser.email}
                  </li>
                  <li>
                    <strong>Password:</strong> ****
                  </li>
                </ul>
              </div>

              {/* Interests Section - Only show for attendees */}
              {currentUser.role === "attendee" && (
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow space-y-4">
                  <h2 className="text-2xl font-semibold border-b pb-2 text-gray-800">
                    Interests
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {defaultDomains.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => toggleDomain(domain)}
                        className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                          interests.includes(domain)
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800">Other Interests</h3>
                    <div className="mt-2 flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add custom interest"
                        className="flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleAddInterest}
                        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition-colors"
                      >
                        Add Interest
                      </button>
                    </div>
                  </div>
                  {interests.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        Selected Interests
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {interests.map((interest, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full shadow transition-transform transform hover:scale-105"
                          >
                            <span className="text-gray-800">{interest}</span>
                            <button
                              onClick={() => handleRemoveInterest(interest)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xl mt-12">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
