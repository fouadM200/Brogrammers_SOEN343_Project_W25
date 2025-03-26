// src/EventEntryDetails.jsx
import React, { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import QRCode from "react-qr-code";

const DisplayAccessCode = ({ event, user, onOk }) => {
  const [showToast, setShowToast] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!event || !user) {
      console.error("Missing event or user data in DisplayAccessCode");
      setLoading(false);
      return;
    }
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found; cannot fetch payment details.");
          setLoading(false);
          return;
        }
        const res = await fetch(
          `http://localhost:5000/api/payments?eventId=${event._id}&userId=${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch payment details");
        }
        const payments = await res.json();
        if (payments.length > 0) {
          setAccessCode(payments[0].accessCode || "");
          setQrCodeData(payments[0].qrCode || "");
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [event, user]);

  const handleCopy = () => {
    if (!accessCode) return;
    navigator.clipboard.writeText(accessCode);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          <p>Loading event entry details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-fade-in-out">
            <Check size={18} className="text-green-400" />
            Copied to clipboard!
          </div>
        </div>
      )}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md text-center animate-fade-in space-y-6">
          <h2 className="text-xl font-bold text-black">
            Event Entry Details for {event?.title || "Unnamed Event"} event
          </h2>

          {/* Show QR Code for in-person or hybrid events */}
          {(event.mode.toLowerCase() === "in-person" ||
            event.mode.toLowerCase() === "hybrid") &&
            qrCodeData && (
              <div>
                <p className="text-lg font-semibold text-black mb-2">QR Code</p>
                <div className="flex justify-center">
                  <div className="bg-white p-2 rounded">
                    <QRCode value={qrCodeData} size={150} />
                  </div>
                </div>
              </div>
            )}

          {/* Show access code for online or hybrid events */}
          {(event.mode.toLowerCase() === "online" ||
            event.mode.toLowerCase() === "hybrid") &&
            accessCode && (
              <div>
                <p className="text-lg font-semibold text-black mb-2">Access Code</p>
                <div className="flex justify-center items-center gap-2 text-xl font-mono text-gray-800">
                  {accessCode}
                  <button onClick={handleCopy} className="hover:text-blue-600">
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            )}

          {/* Fallback message */}
          {!accessCode && !qrCodeData && (
            <p className="text-red-500">
              No entry details found. Did you complete payment?
            </p>
          )}

          <button
            onClick={onOk}
            className="w-full py-3 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default DisplayAccessCode;
