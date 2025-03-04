import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import OrganizerDashboard from "./OrganizerDashboard";
import Auth from "./Auth";
import SignOut from "./SignOut";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user); // Update state when app loads
  }, []);

  const handleAuth = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user); // Update state when logging in
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null); // Clear user state
  };

  return (
    <Router>
      <Routes>
        {/* Dynamically route based on user role */}
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              currentUser.role === "organizer" ? (
                <OrganizerDashboard user={currentUser} />
              ) : (
                <UserDashboard />
              )
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
        <Route path="/signout" element={<SignOut onSignOut={handleSignOut} />} />
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/auth"} />} />
      </Routes>
    </Router>
  );
};

export default App;
