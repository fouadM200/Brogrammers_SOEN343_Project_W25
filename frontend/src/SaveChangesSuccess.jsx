import React from "react";

const SaveChangesSuccess = ({ eventName, onOk }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center animate-fade-in">
        {/* Animated Check Icon */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-20 h-20"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#22c55e"
              strokeWidth="8"
              fill="none"
              className="circle-animation"
            />
            <path
              d="M40 65 L55 80 L85 45"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="checkmark-animation"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-xl font-semibold mb-4">
          "{eventName}" event details have been successfully changed.
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

export default SaveChangesSuccess;