import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
//import QRCode from "react-qr-code";

const DisplayAccessCode = ({ eventName = "Sample Event", onOk }) => {
  const [showToast, setShowToast] = useState(false);
  const hardcodedAccessCode = "ABCD1234";

  const handleCopy = () => {
    navigator.clipboard.writeText(hardcodedAccessCode);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000); // Toast disappears after 2 seconds
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 animate-fade-in-out">
            <Check size={18} className="text-green-400" />
            Copied to clipboard!
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md text-center animate-fade-in space-y-6">
          {/* Main Title */}
          <h2 className="text-xl font-bold text-black">
            Event Entry Details for {eventName}
          </h2>


          {/* QR Code Section */}
          <div>
            <p className="text-lg font-semibold text-black mb-2">QR Code</p>
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com"
                  alt="QR Code"
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Access Code Section */}
          <div>
            <p className="text-lg font-semibold text-black mb-2">Access Code</p>
            <div className="flex justify-center items-center gap-2 text-xl font-mono text-gray-800">
              {hardcodedAccessCode}
              <button onClick={handleCopy} className="hover:text-blue-600">
                <Copy size={20} />
              </button>
            </div>
          </div>

          {/* OK Button */}
          <button
            onClick={onOk}
            className="w-full py-3 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            OK
          </button>

          {/* Dev Note */}
          <p className="text-sm text-red-600 mt-2">
            * This component currently uses hardcoded access codes and QR. It should be implemented in the backend to generate real and unique codes for each attendee and saved in the database.
            <br />
            🔒 Display QR codes for <strong>hybrid</strong> and <strong>in-person</strong> events.
            <br />
            🔑 Display access codes for <strong>online</strong> and <strong>hybrid</strong> events.
          </p>
        </div>
      </div>
    </>
  );
};

export default DisplayAccessCode;
