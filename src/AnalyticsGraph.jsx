// src/AnalyticsGraph.jsx
import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function AnalyticsGraph({ user }) {
  const { eventId } = useParams();
  const location = useLocation();
  const event = location.state?.event; // Optional: use passed event data

  // Sidebar toggle state and sign out confirmation
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get the sidebar instance
  const sidebar = SidebarSingleton.getInstance(user, () => setShowConfirm(true)).getSidebar();

  // Mock data for charts
  const mockData = [
    { label: "Week 1", attendees: 30, revenue: 600 },
    { label: "Week 2", attendees: 40, revenue: 800 },
    { label: "Week 3", attendees: 25, revenue: 500 },
    { label: "Week 4", attendees: 35, revenue: 700 },
  ];

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {sidebar}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold">
            Event Analytics: {event?.title || eventId}
          </h1>
          <p className="text-gray-600 mt-1">
            Detailed analytics and performance data for this event.
          </p>
          <hr className="my-2 border-gray-300" />

          {/* Line Chart Section */}
          <section className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Attendance &amp; Revenue (Line Chart)
            </h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendees" stroke="#8884d8" name="Attendees" />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Bar Chart Section */}
          <section className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Attendance &amp; Revenue (Bar Chart)
            </h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendees" fill="#8884d8" name="Attendees" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <QuitConfirmation
            onConfirm={() => {
              setShowConfirm(false);
              // Navigate to auth page after sign out
              window.location.href = "/auth";
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}
    </div>
  );
}




/* npm install recharts*/