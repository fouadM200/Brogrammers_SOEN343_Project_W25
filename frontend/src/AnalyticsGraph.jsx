import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
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
  const event = location.state?.event;
  const [registrations, setRegistrations] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [engagementData, setEngagementData] = useState({ messageCount: 0 }); // Changed initial value
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await fetch(`http://localhost:5000/api/events/registrations/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch registration details: ${res.status}`);
        const data = await res.json();
        console.log("Registrations for Event ID", eventId, ":", data);
        setRegistrations(data);

        const trends = data.reduce((acc, reg) => {
          const date = new Date(reg.paymentDate).toLocaleDateString("en-CA");
          const existing = acc.find(t => t.date === date) || { date, registrationCount: 0, totalRevenue: 0 };
          existing.registrationCount += 1;
          existing.totalRevenue += reg.amount === "Free" ? 0 : parseFloat(reg.amount || 0);
          if (!acc.find(t => t.date === date)) acc.push(existing);
          return acc;
        }, []).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const totalRevenue = trends.reduce((sum, t) => sum + t.totalRevenue, 0);
        const totalAttendees = data.length;
        setTotalData([{ name: event?.title || "Event", attendees: totalAttendees, revenue: totalRevenue }]);

        fetch("http://localhost:5000/api/analytics/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => {
            const filtered = data.find(item => item._id === eventId);
            setFeedbackData(filtered || {});
          });

        // Changed to fetch chat messages and count them
        const messagesRes = await fetch(`http://localhost:5000/api/chat?eventId=${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (messagesRes.ok) {
          const messages = await messagesRes.json();
          setEngagementData({ messageCount: messages.length });
        } else {
          setEngagementData({ messageCount: 0 });
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setRegistrations([]);
        setTotalData([]);
        setEngagementData({ messageCount: 0 }); // Reset on error
      }
    };

    fetchAnalytics();
  }, [eventId]);

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Event Analytics Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Event Title: ${event?.title || eventId}`, 14, 30);

    if (registrations.length > 0) {
      const trends = registrations.reduce((acc, reg) => {
        const date = new Date(reg.paymentDate).toLocaleDateString("en-CA");
        const existing = acc.find(t => t.date === date) || { date, registrationCount: 0, totalRevenue: 0 };
        existing.registrationCount += 1;
        existing.totalRevenue += reg.amount === "Free" ? 0 : parseFloat(reg.amount || 0);
        if (!acc.find(t => t.date === date)) acc.push(existing);
        return acc;
      }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

      autoTable(doc, {
        startY: 40,
        head: [["Date", "Attendees", "Revenue"]],
        body: trends.map(item => [item.date, item.registrationCount, `$${item.totalRevenue}`])
      });
    }

    let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60;
    doc.text("Feedback Summary:", 14, y);
    doc.text(`Average Rating: ${feedbackData?.avgRating?.toFixed(2) || "0"} ⭐️`, 14, y + 10);
    doc.text(`Total Feedback Entries: ${feedbackData?.feedbackCount || "0"}`, 14, y + 20);
    doc.text("Session Engagement:", 14, y + 35);
    doc.text(`Total Messages Sent: ${engagementData.messageCount}`, 14, y + 45); // Updated to match state

    const addChartToPDF = async (ref, yPos) => {
      if (!ref.current) return;
      const canvas = await html2canvas(ref.current);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 14, yPos, 180, 80);
    };

    await addChartToPDF(lineChartRef, y + 60);
    await addChartToPDF(barChartRef, y + 150);
    doc.save("event_analytics_report.pdf");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const sidebar = SidebarSingleton.getInstance(user, () => setShowConfirm(true)).getSidebar();

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {sidebar}
      </div>

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
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mt-4"
          >
            Download Report as PDF
          </button>
          <hr className="my-2 border-gray-300" />
          <section className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Registration Details</h2>
            {registrations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Email</th>
                      <th className="px-4 py-2 border">Amount</th>
                      <th className="px-4 py-2 border">Card Last 4</th>
                      <th className="px-4 py-2 border">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 border">{reg.userId?.name || "N/A"}</td>
                        <td className="px-4 py-2 border">{reg.userId?.email || "N/A"}</td>
                        <td className="px-4 py-2 border">{reg.amount}</td>
                        <td className="px-4 py-2 border">{reg.cardLast4 || "N/A"}</td>
                        <td className="px-4 py-2 border">
                          {new Date(reg.paymentDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No registration data available for this event.</p>
            )}
          </section>
          <section className="bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Payment Trends (Line Chart)
            </h2>
            {registrations.length > 0 ? (
              <div ref={lineChartRef} className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={registrations.reduce((acc, reg) => {
                      const date = new Date(reg.paymentDate).toLocaleDateString("en-CA");
                      const existing = acc.find(t => t.date === date) || { date, registrationCount: 0, totalRevenue: 0 };
                      existing.registrationCount += 1;
                      existing.totalRevenue += reg.amount === "Free" ? 0 : parseFloat(reg.amount || 0);
                      if (!acc.find(t => t.date === date)) acc.push(existing);
                      return acc;
                    }, []).sort((a, b) => new Date(a.date) - new Date(b.date))}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="registrationCount" stroke="#8884d8" name="Attendees" />
                    <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No payment data available for this event.</p>
            )}
          </section>

          <section className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Total Attendees and Revenue (Bar Chart)
            </h2>
            {totalData.length > 0 ? (
              <div ref={barChartRef} className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={totalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendees" fill="#8884d8" name="Attendees" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No payment data available for this event.</p>
            )}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <section className="bg-white p-4 shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Feedback Summary</h2>
              {feedbackData.avgRating ? (
                <p className="text-gray-700">
                  Average Rating: {feedbackData.avgRating.toFixed(2)} ⭐️ <br />
                  Total Feedback Entries: {feedbackData.feedbackCount || 0}
                </p>
              ) : (
                <p>No feedback data available.</p>
              )}
            </section>

            {/* Session Engagement Section (No Change Needed Here) */}
            <section className="bg-white p-4 shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Session Engagement</h2>
              {engagementData.messageCount ? (
                <p className="text-gray-700">
                  Total Messages Sent: {engagementData.messageCount}
                </p>
              ) : (
                <p className="text-gray-500">No messages sent yet.</p>
              )}
            </section>
          </div>
        </main>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <QuitConfirmation
            onConfirm={() => {
              setShowConfirm(false);
              window.location.href = "/auth";
            }}
            onCancel={() => setShowConfirm(false)}
          />
        </div>
      )}
    </div>
  );
}