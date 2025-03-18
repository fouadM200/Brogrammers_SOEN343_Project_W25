import React from "react";

const CancelCreateNewEvent = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to discard changes?</h2>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelCreateNewEvent;
