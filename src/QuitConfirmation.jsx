import React from "react";

const QuitConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[28rem] text-center">
        <h2 className="text-xl font-semibold mb-6">
          Sign out
        </h2>
        <p className="text-m mb-6">
        Are you sure you want to log out?
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={onConfirm}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-100 px-6 py-3 rounded-lg hover:bg-gray-200"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuitConfirmation;
