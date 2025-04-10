// src/SignOut.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut({ onSignOut }) {
  const navigate = useNavigate();

    // Set the browser tab title when the component mounts
    useEffect(() => {
      document.title = "SEES | Sign in"; // Customize your title here
    }, []);

  useEffect(() => {
    // Remove token & user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    // Let App know we've signed out
    onSignOut();

    // Redirect to login
    navigate("/auth");
  }, [navigate, onSignOut]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-700">Signing out...</h1>
    </div>
  );
}
