import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import logo from "./assets/Version3.png";

export default function HeaderMenuBar({ toggleSidebar }) {
  return (
    <header className="bg-gray-400 shadow-sm p-4 flex items-center">
      {/* Button on the left */}
      <button
        className="p-2 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-indigo-500"
        onClick={toggleSidebar}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Spacer that grows to fill available space and centers the logo */}
      <div className="flex-1 flex justify-center">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
      </div>
    </header>
  );
}
