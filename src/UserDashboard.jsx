import { useState, useEffect } from "react";
import UserSideMenuBar from "./UserSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar";

export default function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Retrieve the user from localStorage
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <UserSideMenuBar user={currentUser} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold">Hello, {currentUser?.name || "User"}!</h1>
          <p className="text-gray-600">Welcome to your Dashboard.</p>
          <hr className="my-2 border-gray-300" />
          
          <h2 className="text-2xl font-semibold mt-6">Your Upcoming Events</h2>
          <hr className="my-2 border-gray-300" />

          {/* Upcoming Events Section */}
          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="bg-white p-4 shadow-md rounded-md hover:bg-gray-200 transition duration-300">
              <h3 className="text-lg font-semibold">Upcoming Event 1</h3>
              <hr className="my-2 border-gray-300" />
              <p className="text-gray-500">Speaker: John Doe</p>
              <p className="text-gray-500">Date: March 10, 2025</p>
              <p className="text-gray-500">Time: 2:00 PM - 4:00 PM</p>
            </div>

            <div className="bg-white p-4 shadow-md rounded-md hover:bg-gray-200 transition duration-300">
              <h3 className="text-lg font-semibold">Upcoming Event 2</h3>
              <hr className="my-2 border-gray-300" />
              <p className="text-gray-500">Speaker: Jane Smith</p>
              <p className="text-gray-500">Date: March 15, 2025</p>
              <p className="text-gray-500">Time: 10:00 AM - 12:00 PM</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
