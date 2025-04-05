import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarSingleton from "./SidebarSingleton";
import HeaderMenuBar from "./HeaderMenuBar";
import QuitConfirmation from "./QuitConfirmation";
import PaymentConfirmationOverlay from "./PaymentConfirmationOverlay";

const PaymentScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, user } = location.state || {};

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // Set the browser tab title when the component mounts
  useEffect(() => {
    document.title = "SEES | Checkout"; // Customize your title here
  }, []);

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
    if (user && user.university && user.university.trim() !== "") {
      if (user.university.toLowerCase().includes("concordia")) {
        return event.registration.concordiaStudents;
      } else {
        return event.registration.otherStudents || event.registration.regular;
      }
    }
    return event.registration.regular;
  };

  const feeAmount = computeFee();

  // Determine card type based on card number input
  let cardType = "";
  if (cardNumber.startsWith("4")) {
    cardType = "visa";
  } else if (cardNumber.startsWith("5")) {
    cardType = "mastercard";
  } else if (cardNumber.startsWith("34") || cardNumber.startsWith("37")) {
    cardType = "amex";
  }

  // Choose the appropriate front image based on cardType
  const frontImage =
    cardType === "visa"
      ? "/credit_card_front_side_visa.png"
      : cardType === "mastercard"
      ? "/credit_card_front_side_mastercard.png"
      : cardType === "amex"
      ? "/credit_card_front_side_amex.png"
      : "/credit_card_front_side_default.png";

  // Helper function to format card number with a space every 4 digits
  function formatCardNumber(num) {
    return num
      .replace(/\D/g, "") // remove non-digit characters
      .replace(/(\d{4})(?=\d)/g, "$1 "); // insert space after every 4 digits
  }

  // Handler to auto-format expiry date (MM/YY)
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // allow only digits
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  // Handler to allow only 3-digit CVV
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // only digits
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  // 2) Handle Payment
  const handlePayment = async (e) => {
    e.preventDefault();

    // For free registration, skip card validations
    if (feeAmount.toLowerCase() === "free") {
      if (!event || !user) {
        alert("Missing event or user information.");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to complete payment.");
        return;
      }

      setProcessing(true);
      try {
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
      } catch (error) {
        console.error("Payment error:", error);
        alert("Payment error: " + error.message);
      } finally {
        setProcessing(false);
      }
      return;
    }

    // For paid registration, perform validations
    if (!cardHolderName.trim()) {
      alert("Cardholder name cannot be empty.");
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s+/g, "");
    if (cardType === "amex" && cleanCardNumber.length !== 15) {
      alert("American Express card number must be 15 digits.");
      return;
    }
    if ((cardType === "visa" || cardType === "mastercard") && cleanCardNumber.length !== 16) {
      alert("Visa/Mastercard card number must be 16 digits.");
      return;
    }
    if (expiryDate.length !== 5 || expiryDate.indexOf("/") !== 2) {
      alert("Expiry date must be in MM/YY format.");
      return;
    }
    if (cvv.length !== 3) {
      alert("CVV must be exactly 3 digits.");
      return;
    }

    if (!event || !user) {
      alert("Missing event or user information.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to complete payment.");
      return;
    }

    setProcessing(true);
    try {
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
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment error: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // 3) Register user for event after the overlay is closed
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

  const sidebar = SidebarSingleton.getInstance(user, () => setShowConfirm(true)).getSidebar();

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {sidebar}
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
          <p className="mb-4 text-lg">
            Accepted payment methods:{" "}
            <span className="font-semibold">Visa, Mastercard, American Express</span>
          </p>
          <hr className="my-2 border-gray-300" />
          <br />

          {feeAmount.toLowerCase() === "free" ? (
            <>
              <div className="max-w-md bg-white p-6 rounded shadow-md">
                <p className="mb-4 text-lg text-center">
                  No payment required for Concordia students. Click below to finalize registration.
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
              <div className="max-w-md mt-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/event_description", { state: { event, user } })
                  }
                  className="w-full p-3 rounded bg-gray-800 text-white hover:bg-gray-900 transition"
                >
                  Cancel Registration
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-start space-x-16">
                <form onSubmit={handlePayment} id="paymentForm" className="max-w-lg">
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

                  <div className="mb-4 relative">
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
                        onChange={handleExpiryDateChange}
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
                        onChange={handleCvvChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  </div>
                </form>

                <div className="credit-card-container">
                  <div className="credit-card">
                    <div className="card-face card-front relative">
                      <img
                        src={frontImage}
                        alt="Credit Card Front"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-6 left-10 text-white">
                        <div className="text-xl tracking-[0.3em]">
                          {cardNumber
                            ? formatCardNumber(cardNumber)
                            : "•••• •••• •••• ••••"}
                        </div>
                        <div className="mt-4 flex space-x-8 text-sm">
                          <div className="text-left">
                            <span className="block uppercase text-xs">Cardholder</span>
                            <span>
                              {cardHolderName ? cardHolderName.toUpperCase() : ""}
                            </span>
                          </div>
                          <div className="text-left">
                            <span className="block uppercase text-xs">Expiry Date</span>
                            <span>{expiryDate ? expiryDate : "MM/YY"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-face card-back relative">
                      <img
                        src="/credit_card_theme_back.png"
                        alt="Credit Card Back"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2/5 right-30 transform -translate-y-1/2 text-black text-lg font-mono">
                        {cvv ? cvv : "•••"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() =>
                    navigate("/event_description", { state: { event, user } })
                  }
                  className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
                >
                  Cancel Payment
                </button>
                <button
                  type="submit"
                  form="paymentForm"
                  className={`px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition ${
                    processing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={processing}
                >
                  {processing ? "Processing Payment..." : "Submit Payment"}
                </button>
              </div>
            </>
          )}
        </main>
      </div>

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
