import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import PaymentConfirmationOverlay from "./PaymentConfirmationOverlay";

const PaymentScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, user } = location.state || {};

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // Credit card fields
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  // Overlay for success
  const [showConfirmationOverlay, setShowConfirmationOverlay] = useState(false);
  const [generatedAccessCode, setGeneratedAccessCode] = useState("");
  const [generatedQRData, setGeneratedQRData] = useState("");

  // 1) Determine the fee
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

  // 2) Handle Payment
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!event || !user) {
      alert("Missing event or user information.");
      return;
    }

    // Make sure we have a valid token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to complete payment.");
      return;
    }

    setProcessing(true);

    try {
      if (feeAmount.toLowerCase() === "free") {
        // --- FREE PAYMENT LOGIC ---
        const freePaymentRes = await fetch("http://localhost:5000/api/payments/free", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        });
        if (!freePaymentRes.ok) {
          const err = await freePaymentRes.json();
          throw new Error(err.error || "Free payment failed.");
        }
        const paymentData = await freePaymentRes.json();
        setGeneratedAccessCode(paymentData.payment.accessCode);
        setGeneratedQRData(paymentData.payment.qrCode);
        setShowConfirmationOverlay(true);
      } else {
        // --- PAID PAYMENT LOGIC ---
        if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
          alert("Please fill in all credit card details.");
          setProcessing(false);
          return;
        }

        const paymentRes = await fetch("http://localhost:5000/api/payments", {
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

        if (!paymentRes.ok) {
          const err = await paymentRes.json();
          throw new Error(err.error || "Payment failed.");
        }
        const paymentData = await paymentRes.json();
        setGeneratedAccessCode(paymentData.payment.accessCode);
        setGeneratedQRData(paymentData.payment.qrCode);
        setShowConfirmationOverlay(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment error: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // 3) Register user for event *after* the overlay is closed
  const closeConfirmationOverlay = async () => {
    setShowConfirmationOverlay(false);

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
          <h1 className="text-3xl font-bold mb-4">
            Payment for {event?.title || "Event"}
          </h1>
          <p className="mb-4 text-lg">
            Registration Fee:{" "}
            <span className="font-semibold">
              {feeAmount.toLowerCase() === "free"
                ? "Free"
                : `$${feeAmount} CAD`}
            </span>
          </p>

          {/* If fee is FREE, hide the card form and show a "Register for Free" button.
              Otherwise, show the credit card form. */}
          {feeAmount.toLowerCase() === "free" ? (
            <div className="max-w-md bg-white p-6 rounded shadow-md">
              <p className="mb-4 text-lg">
                No payment required for Concordia students. Click below to
                finalize registration.
              </p>
              <button
                type="button"
                onClick={handlePayment}
                className={`w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition ${
                  processing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={processing}
              >
                {processing ? "Processing..." : "Register for Free"}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handlePayment}
              className="max-w-md bg-white p-6 rounded shadow-md"
            >
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                  Cardholder Name
                </label>
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
                  <label className="block text-gray-700 mb-1">
                    Expiry Date
                  </label>
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
          )}

          <button
            onClick={() =>
              navigate("/event_description", { state: { event, user } })
            }
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

      {/* Payment Confirmation Overlay */}
      {showConfirmationOverlay && (
        <PaymentConfirmationOverlay
          event={event}
          accessCode={generatedAccessCode}
          qrData={generatedQRData}
          onClose={closeConfirmationOverlay}
        />
      )}
    </div>
  );
};

export default PaymentScreen;
