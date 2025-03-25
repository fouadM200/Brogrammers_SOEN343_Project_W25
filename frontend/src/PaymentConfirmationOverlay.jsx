import React from "react";
import QRCode from "react-qr-code";

const PaymentConfirmationOverlay = ({ event, accessCode, qrData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Payment Confirmation</h2>
        <p className="mb-4">Your payment was successful! Here are your access details for <strong>{event.title}</strong>:</p>
        
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
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmationOverlay;
