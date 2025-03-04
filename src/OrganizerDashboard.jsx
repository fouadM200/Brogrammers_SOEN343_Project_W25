import { useState } from "react";
import OrganizerSideMenuBar from "./OrganizerSideMenuBar";
import HeaderMenuBar from "./HeaderMenuBar"; // Import the new header component

export default function OrganizerDashboard({ user }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen transition-all duration-300 ease-in-out">
      {/* Sidebar with Push Effect */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <OrganizerSideMenuBar user={user} />
      </div>

      {/* Main Content - Pushes when Sidebar is Open */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Use HeaderMenuBar Component */}
        <HeaderMenuBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <main className="p-6 bg-gray-100 flex-1">
          <h1 className="text-3xl font-bold">Hello, {user?.name || "-- user first name --"}!</h1>
          <p className="text-gray-600">Welcome to your Dashboard.</p>
          <hr className="my-2 border-gray-300" />
          
          <h2 className="text-2xl font-semibold mt-6">Title...</h2>
          <hr className="my-2 border-gray-300" />
        </main>
      </div>
    </div>
  );
}
