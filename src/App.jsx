import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SelectChatroom from "./SelectChatroom"; 
import UserDashboard from './UserDashboard';
import OrganizerDashboard from "./OrganizerDashboard";
import Auth from "./Auth";
import SignOut from "./SignOut";
import Homepage from './Homepage';
import ForgotPassword from "./ForgotPassword"; 
import Chatroom from "./Chatroom";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const handleAuth = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} /> {/* ✅ Set Homepage as default route */}
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
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ Added Forgot Password Route */}
        <Route path="/select_chatroom" element={<SelectChatroom user={currentUser} onSignOut={handleSignOut} />} />
        <Route path="/chatroom" element={<Chatroom user={currentUser} onSignOut={handleSignOut} />}/>
        </Routes>
    </Router>
  );
};

export default App;
