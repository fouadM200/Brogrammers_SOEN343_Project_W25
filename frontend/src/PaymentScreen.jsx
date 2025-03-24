import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";

const PaymentScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expecting event and user in location.state
  const { event, user } = location.state || {};

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // Payment form state
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  // Compute the correct fee based on the user's university affiliation.
  // If the user's university contains "concordia" (case-insensitive), use concordiaStudents price.
  // Otherwise, if a university is provided, use otherStudents price; if not, fallback to regular price.
  const computeFee = () => {
    if (!event || !event.registration) return "";
    if (user && user.university) {
      if (user.university.toLowerCase().includes("concordia")) {
        return event.registration.concordiaStudents;
      } else {
        return event.registration.otherStudents || event.registration.regular;
      }
    }
    return event.registration.regular;
  };


  const feeAmount = computeFee();

  // Handle form submission for payment
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!event || !user) {
      alert("Missing event or user information.");
      return;
    }
    // Basic validation for card info fields
    if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
      alert("Please fill in all credit card details.");
      return;
    }
    if (feeAmount.toLowerCase() === "free") {
      await registerForEvent();
      return;
    }
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to complete payment.");
        setProcessing(false);
        return;
      }

      // Send payment details to the backend
      const paymentResponse = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          amount: feeAmount,
          cardHolderName,
          cardNumber,
          expiryDate,
          cvv,
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Payment failed.");
      }

      alert("Payment processed successfully.");

      await registerForEvent();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment error: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // Function to register the event for the user after successful payment
  const registerForEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to register for the event.");
        return;
      }
      const res = await fetch("http://localhost:5000/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event._id }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Event registration failed.");
      }
      alert("Event registered successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("Registration error: " + error.message);
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
        <UserSideMenuBar user={user} onSignOut={() => setShowConfirm(true)} />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 bg-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold mb-4">Payment for {event?.title || "Event"}</h1>
          <p className="mb-4 text-lg">
            Registration Fee:{" "}
            <span className="font-semibold">
              {feeAmount.toLowerCase() === "free" ? "Free" : `$${feeAmount} CAD`}
            </span>
          </p>

          <form onSubmit={handlePayment} className="max-w-md bg-white p-6 rounded shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., 4111111111111111"
                required
              />
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="w-24">
                <label className="block text-gray-700 mb-1">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition ${
                processing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={processing}
            >
              {processing ? "Processing Payment..." : "Submit Payment"}
            </button>
          </form>

          <button
            onClick={() => navigate("/event_description", { state: { event, user } })}
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            Cancel Payment
          </button>
        </main>
      </div>

      {/* Quit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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

export default PaymentScreen;