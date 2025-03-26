import React from "react";
import QRCode from "react-qr-code";

const PaymentConfirmationOverlay = ({ event, accessCode, qrData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Payment Confirmation</h2>
        <p className="mb-4">Your payment was successful! Here are your access details for <strong>{event.title}</strong> event:</p>

        {/* Success Animation */}
        <div className="my-6">
          <svg
            className="mx-auto mb-4"
            width="100"
            height="100"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              className="circle-animation"
            />
            <polyline
              points="40,65 55,80 85,50"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="checkmark-animation"
            />
          </svg>
        </div>

        
        {/* For in-person or hybrid events, show a QR code */}
        {(event.mode.toLowerCase() === "in-person" ||
        event.mode.toLowerCase() === "hybrid") && qrData && (
        <div className="mb-4 text-center">
            <h3 className="text-xl font-semibold mb-2">QR Code for In-Person Access</h3>
            <div className="flex justify-center">
            <QRCode value={qrData} size={150} />
            </div>
        </div>
        )}


        {/* For online or hybrid events, show an access code */}
        {(event.mode.toLowerCase() === "online" ||
          event.mode.toLowerCase() === "hybrid") && accessCode && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Access Code for Online Access</h3>
            <p className="text-lg font-mono bg-gray-200 p-2 rounded">{accessCode}</p>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-gray-800 text-white text-lg rounded hover:bg-gray-900 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmationOverlay;
