import { useNavigate, useLocation } from "react-router-dom";

export default function UserSideMenuBar({ user, onSignOut }) {
  const navigate = useNavigate();

  // Ensure user is not null
  const currentUser = user || { name: "Guest", email: "" };
  const location = useLocation();

  // Safely extract initials
  const nameParts = currentUser?.name?.trim()?.split(" ") || ["G"];
  const initials =
    nameParts.length > 1
      ? (nameParts[0][0]?.toUpperCase() || "") + (nameParts[1][0]?.toUpperCase() || "")
      : (nameParts[0][0]?.toUpperCase() || "G");

  // Navigation links
  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Search Events", href: "/search_events" },
    { name: "Chatroom", href: location.pathname.startsWith("/chatroom") ? "/chatroom" : "/select_chatroom" }
  ];

  // User navigation links
  const userNavigation = [
    { name: "Your Profile", href: "" },
    { name: "Sign out", action: onSignOut },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4 h-full">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
          {initials}
        </div>
        <span className="text-lg font-semibold mt-2">{currentUser.name}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.href)}
            className={`block px-4 py-2 w-full text-left rounded-md transition ${
              (item.href === "/search_events" && ["/search_events", "/event_description"].includes(location.pathname)) ||
              location.pathname === item.href
                ? "bg-white text-black"
                : "text-white hover:bg-gray-700"
            }`}            
          >
            {item.name}
          </button>
        ))}
      </nav>

      {/* User Navigation at the Bottom */}
      <div className="mt-auto border-t border-gray-700 pt-4">
      {userNavigation.map((item) => (
        <button
          key={item.name}
          onClick={item.action || (() => navigate(item.href))}
          className={`block px-4 py-2 w-full text-left rounded-md transition ${
            location.pathname === item.href
              ? "bg-white text-black"
              : "text-white hover:bg-gray-700"
          }`}
        >
          {item.name}
        </button>
      ))}
      </div>
    </div>
  );
}
