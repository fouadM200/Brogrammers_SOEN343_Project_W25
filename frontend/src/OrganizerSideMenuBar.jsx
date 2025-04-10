import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrganizerSideMenuBar({ user, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure user is not null
  const currentUser = user || { name: "Guest", email: "" };

  // Extract initials from the user's name
  const nameParts = currentUser.name.trim().split(" ");
  const initials =
    nameParts.length > 1
      ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
      : nameParts[0][0].toUpperCase();

  // Main navigation links
  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Create new event", href: "/create_event" },
    { name: "Analytics & Reporting", href: "/organizer/analytics" },
  ];

  // User navigation links
  const userNavigation = [
    { name: "Your Profile", href: "/profile" },
    { name: "Sign out", action: onSignOut },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 min-h-screen">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-blue-500 flex items-center justify-center rounded-full text-xl font-bold">
          {initials}
        </div>
        <span className="text-lg font-semibold mt-2">{currentUser.name}</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          let isActive = false;
          if (item.href === "/dashboard") {
            isActive = location.pathname === "/dashboard";
          } else if (item.href === "/create_event") {
            isActive = location.pathname === "/create_event";
          } else if (item.href === "/organizer/analytics") {
            // For Analytics and Reporting, check if the current pathname starts with "/organizer/analytics"
            isActive = location.pathname.startsWith("/organizer/analytics");
          }
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={`block px-4 py-2 w-full text-left rounded-md transition ${
                isActive ? "bg-white text-black" : "text-white hover:bg-gray-700"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User Navigation at the Bottom */}
      <div className="mt-auto border-t border-gray-700 pt-4 space-y-2">
        {userNavigation.map((item) => (
          <div key={item.name}>
            <button
              onClick={item.action || (() => navigate(item.href))}
              className={`block px-4 py-2 w-full text-left rounded-md transition ${
                location.pathname === item.href
                  ? "bg-white text-black"
                  : "text-white hover:bg-gray-700"
              }`}
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
