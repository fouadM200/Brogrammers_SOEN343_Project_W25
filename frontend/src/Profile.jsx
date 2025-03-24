import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSideMenuBar from "./UserSideMenuBar";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
      setInterests(user.interests || []);
    }
  }, []);

  const handleAddInterest = () => {
    if (newInterest.trim() !== "") {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      setNewInterest("");

      const updatedUser = { ...currentUser, interests: updatedInterests };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const handleRemoveInterest = (interest) => {
    const updatedInterests = interests.filter(i => i !== interest);
    setInterests(updatedInterests);

    const updatedUser = { ...currentUser, interests: updatedInterests };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <UserSideMenuBar user={currentUser} onSignOut={() => navigate("/auth")} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        {currentUser ? (
          <div className="mt-4">
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>University:</strong> {currentUser.university || "Not specified"}</p>

            <h2 className="text-xl font-semibold mt-4">Interests</h2>
            <div className="mt-2">
              {interests.length > 0 ? (
                interests.map((interest, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="bg-gray-200 px-2 py-1 rounded">{interest}</span>
                    <button onClick={() => handleRemoveInterest(interest)} className="text-red-500">
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No interests added yet.</p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add new interest"
                className="border p-2 rounded w-full"
              />
              <button onClick={handleAddInterest} className="bg-blue-500 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
