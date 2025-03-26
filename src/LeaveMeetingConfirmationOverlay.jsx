// src/LeaveMeetingConfirmation.jsx
import React from "react";

const LeaveMeetingConfirmation = ({ eventName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Are you sure you want to leave <strong>{eventName}</strong> event?
        </h2>
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onConfirm}
            className="bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-gray-900 transition-colors"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveMeetingConfirmation;
