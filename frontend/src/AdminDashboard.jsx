// src/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSideMenuBar from "./AdminSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("events"); // "events", "users", "payments"
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "events") {
      fetch("http://localhost:5000/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setEvents(data));
    } else if (activeTab === "users") {
      fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data));
    } else if (activeTab === "payments") {
      fetch("http://localhost:5000/api/admin/payments", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setPayments(data));
    }
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

  return (
    <div className="flex h-screen relative">
      <AdminSideMenuBar user={user} onSignOut={() => setShowConfirm(true)} />
      <div className="flex-1">
        <HeaderMenuBar toggleSidebar={() => {}} />
        <div className="p-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 ${activeTab === "events" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-4 py-2 ${activeTab === "payments" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Payments
            </button>
          </div>
          <div className="mt-6">
            {activeTab === "events" && (
              <div>
                <h2 className="text-2xl font-semibold">All Events</h2>
                <ul>
                  {events.map((event) => (
                    <li key={event._id} className="border p-4 my-2">
                      <p><strong>{event.title}</strong></p>
                      <p>{event.speaker}</p>
                      <button
                        onClick={() =>
                          navigate("/admin/edit_event", { state: { event } })
                        }
                        className="bg-yellow-500 text-white px-2 py-1 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="bg-red-500 text-white px-2 py-1"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-semibold">All Users</h2>
                <ul>
                  {users.map((u) => (
                    <li key={u._id} className="border p-4 my-2">
                      <p>
                        <strong>{u.name}</strong> - {u.email} - {u.role}
                      </p>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="bg-red-500 text-white px-2 py-1"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "payments" && (
              <div>
                <h2 className="text-2xl font-semibold">All Payments</h2>
                <ul>
                  {payments.map((p) => (
                    <li key={p._id} className="border p-4 my-2">
                      <p>User: {p.userId}</p>
                      <p>Event: {p.eventId}</p>
                      <p>Amount: {p.amount}</p>
                      <button
                        onClick={() => handleDeletePayment(p._id)}
                        className="bg-red-500 text-white px-2 py-1"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
