import React, { useState, useEffect } from "react";

const RegistrationDetailsOverlay = ({ event, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrationDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:5000/api/events/registrations/${event._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch registration details");
        }
        const data = await res.json();
        setRegistrations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrationDetails();
  }, [event]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Registrations for {event.title}</h2>
        {loading ? (
          <p>Loading registration details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : registrations.length === 0 ? (
          <p>No registrations found for this event.</p>
        ) : (
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
                    <td className="px-4 py-2 border">{reg.cardLast4}</td>
                    <td className="px-4 py-2 border">
                      {new Date(reg.paymentDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RegistrationDetailsOverlay;