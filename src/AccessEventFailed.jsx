import React from "react";

const AccessEventFailed = ({ eventName = "Event", onOk }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center animate-fade-in">
        {/* Animated Red Circle + Two-stroke X */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-20 h-20"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Red Circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#ef4444"
              strokeWidth="8"
              fill="none"
              className="circle-animation"
            />

            {/* X Stroke 1 */}
            <path
              d="M45 45 L75 75"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              className="x-stroke-1"
            />

            {/* X Stroke 2 */}
            <path
              d="M75 45 L45 75"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              className="x-stroke-2"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-black mb-4">
          Incorrect access code for <span className="font-bold">{eventName}</span> <br />Please try again.
        </h2>

        <button
          onClick={onOk}
          className="w-full py-3 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AccessEventFailed;
