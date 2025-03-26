import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import logo from "./assets/Version3.png";

export default function HeaderMenuBar({ toggleSidebar }) {
  return (
    <header className="bg-gray-400 shadow-sm p-4 flex justify-between items-center">
    {/* 3-Dashed Lines (Menu Button) */}
      <button
        className="p-2 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-indigo-500"
        onClick={toggleSidebar}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Logo Text (Centered) */}
      <img src={logo} alt="Logo" className="h-16 w-auto" />

      {/* Notification Bell (Right Side) */}
      <button className="p-2 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-indigo-500">
        <BellIcon className="w-6 h-6" />
      </button>
    </header>
  );
}
