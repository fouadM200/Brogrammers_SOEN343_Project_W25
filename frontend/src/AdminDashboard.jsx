// src/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton"; // Use singleton for sidebar
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("events"); // "events", "users", "payments"
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch data based on active tab
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      let endpoint = "";
      if (activeTab === "events") endpoint = "events";
      else if (activeTab === "users") endpoint = "users";
      else if (activeTab === "payments") endpoint = "payments";

      try {
        const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (activeTab === "events") setEvents(data);
        else if (activeTab === "users") setUsers(data);
        else if (activeTab === "payments") setPayments(data);
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      }
    };
    fetchData();
  }, [activeTab, token]);

  const handleDeleteEvent = async (id) => {
    await fetch(`http://localhost:5000/api/admin/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEvents(events.filter((e) => e._id !== id));
  };

  const handleDeleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter((u) => u._id !== id));
  };

  const handleDeletePayment = async (id) => {
    await fetch(`http://localhost:5000/api/admin/payments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPayments(payments.filter((p) => p._id !== id));
  };

  // Retrieve the sidebar via the singleton.
  const sidebar = SidebarSingleton.getInstance(user, () => setShowConfirm(true)).getSidebar();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
          <hr className="my-2 border-gray-300" />

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-6">
            {["events", "users", "payments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "events" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">All Events</h2>
                <hr className="my-2 border-gray-300" />
                {events.length === 0 ? (
                  <p className="text-gray-600">No events available.</p>
                ) : (
                  <ul className="space-y-4">
                    {events.map((event) => (
                      <li
                        key={event._id}
                        className="bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {event.title}
                            </h3>
                            <p className="text-gray-600">{event.speaker}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                navigate("/admin/edit_event", { state: { event, user } })
                              }
                              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event._id)}
                              className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-900 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">All Users</h2>
                <hr className="my-2 border-gray-300" />
                {users.length === 0 ? (
                  <p className="text-gray-600">No users found.</p>
                ) : (
                  <ul className="space-y-4">
                    {users.map((u) => (
                      <li
                        key={u._id}
                        className="bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xl font-bold text-gray-800">{u.name}</p>
                            <p className="text-gray-600">{u.email} - {u.role}</p>
                          </div>
                          <div>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-900 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {activeTab === "payments" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">All Payments</h2>
                <hr className="my-2 border-gray-300" />
                {payments.length === 0 ? (
                  <p className="text-gray-600">No payments found.</p>
                ) : (
                  <ul className="space-y-4">
                    {payments.map((p) => (
                      <li
                        key={p._id}
                        className="bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-800">User: {p.userId}</p>
                            <p className="text-gray-800">Event: {p.eventId}</p>
                            <p className="text-gray-800">Amount: ${p.amount}</p>
                          </div>
                          <div>
                            <button
                              onClick={() => handleDeletePayment(p._id)}
                              className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-900 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

export default AdminDashboard;

