// src/LeaveMeetingSuccessOverlay.jsx
import React from "react";

const LeaveMeetingSuccessOverlay = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-[500px] max-w-full">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-fade-in">Done!</h2>
        <svg
          className="mx-auto mb-6"
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
        <button
          onClick={onClose}
          className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 transition-colors text-lg"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default LeaveMeetingSuccessOverlay;