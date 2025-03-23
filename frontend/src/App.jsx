// src/App.jsx
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
import SearchEvents from "./SearchEvents";
import EventDescription from "./EventDescription";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";
import OnlineEventAccess from './OnlineEventAccess';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // Check for token + user in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (token && user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, []);

  // Called after successful login/registration
  const handleAuth = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (token && user) {
      setCurrentUser(user);
    }
  };

  // Called on sign out
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/select_chatroom" element={<SelectChatroom user={currentUser} onSignOut={handleSignOut} />} />
        <Route path="/chatroom" element={<Chatroom user={currentUser} onSignOut={handleSignOut} />} />
        <Route path="/search_events" element={<SearchEvents user={currentUser} />} />
        <Route path="/event_description" element={<EventDescription user={currentUser} />} />
        <Route path="/create_event" element={<CreateEvent user={currentUser} />} />
        <Route path="/online_event_access" element={<OnlineEventAccess />} />
        <Route path="/edit_event" element={<EditEvent />} />
      </Routes>
    </Router>
  );
};

export default App;
