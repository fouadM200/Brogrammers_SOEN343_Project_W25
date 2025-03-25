// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SelectChatroom from "./SelectChatroom"; 
import UserDashboard from './UserDashboard';
import OrganizerDashboard from "./OrganizerDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminEditEvent from "./AdminEditEvent";
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
import Profile from "./Profile";
import PaymentScreen from "./PaymentScreen";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (token && user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, []);

  const handleAuth = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (token && user) {
      setCurrentUser(user);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Homepage />} />

        <Route 
          path="/dashboard" 
          element={
            currentUser ? (
              currentUser.role === "organizer" ? (
                <OrganizerDashboard user={currentUser} />
              ) : currentUser.role === "attendee" ? (
                <UserDashboard />
              ) : (
                // if admin, force admin dashboard route below
                <Navigate to="/admin" />
              )
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        <Route path="/admin" element={
          currentUser && currentUser.role === "admin" ? (
            <AdminDashboard user={currentUser} />
          ) : (
            <Navigate to="/auth" />
          )
        }/>
        <Route path="/admin/edit_event" element={
          currentUser && currentUser.role === "admin" ? (
            <AdminEditEvent />
          ) : (
            <Navigate to="/auth" />
          )
        }/>

        <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
        <Route path="/signout" element={<SignOut onSignOut={handleSignOut} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/select_chatroom" element={<SelectChatroom user={currentUser} onSignOut={handleSignOut} />} />
        <Route path="/chatroom" element={<Chatroom user={currentUser} onSignOut={handleSignOut} />} />
        <Route path="/search_events" element={<SearchEvents user={currentUser} />} />
        <Route path="/event_description" element={<EventDescription user={currentUser} />} />
        <Route path="/create_event" element={<CreateEvent user={currentUser} />} />
        <Route path="/edit_event" element={<EditEvent />} />
        <Route path="/online_event_access" element={<OnlineEventAccess />} />
        <Route path="/payment" element={<PaymentScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
