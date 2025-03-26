// src/AdminSideMenuBar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSideMenuBar = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = user || { name: "Admin", email: "" };
  const nameParts = currentUser.name.split(" ");
  const initials = nameParts.map((n) => n[0]).join("").toUpperCase();

  const navigation = [
    { name: "Dashboard", href: "/admin" },
    // You can add more admin-specific navigation links here if needed.
  ];

  const userNavigation = [
    { name: "Sign out", action: onSignOut },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 min-h-screen">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-blue-500 flex items-center justify-center rounded-full text-xl font-bold">
          {initials}
        </div>
        <span className="mt-2">{currentUser.name}</span>
      </div>
      <nav className="space-y-2">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.href)}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            {item.name}
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-gray-700 pt-4">
        {userNavigation.map((item) => (
          <button
            key={item.name}
            onClick={item.action || (() => navigate(item.href))}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminSideMenuBar;
