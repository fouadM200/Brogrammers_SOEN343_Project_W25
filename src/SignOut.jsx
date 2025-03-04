import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOut({ onSignOut }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("currentUser"); // Remove from storage
    onSignOut(); // Update React state
    navigate("/auth"); // Redirect to login page
  }, [navigate, onSignOut]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-700">Signing out...</h1>
    </div>
  );
}
