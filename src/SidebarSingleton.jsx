// src/SidebarSingleton.jsx
import React from "react";
import UserSideMenuBar from "./UserSideMenuBar";
import OrganizerSideMenuBar from "./OrganizerSideMenuBar";
import AdminSideMenuBar from "./AdminSideMenuBar";

class SidebarSingleton {
  static instance = null;

  constructor(user, onSignOut) {
    this.user = user;
    this.onSignOut = onSignOut;
  }

  // Updated getInstance: if instance exists, update its user & onSignOut.
  static getInstance(user, onSignOut) {
    if (!SidebarSingleton.instance) {
      SidebarSingleton.instance = new SidebarSingleton(user, onSignOut);
    } else {
      // Update the instance with the new user data
      SidebarSingleton.instance.user = user;
      SidebarSingleton.instance.onSignOut = onSignOut;
    }
    return SidebarSingleton.instance;
  }
  

  getSidebar() {
    if (this.user && this.user.role === "admin") {
      return <AdminSideMenuBar user={this.user} onSignOut={this.onSignOut} />;
    } else if (this.user && this.user.role === "organizer") {
      return <OrganizerSideMenuBar user={this.user} onSignOut={this.onSignOut} />;
    } else {
      return <UserSideMenuBar user={this.user} onSignOut={this.onSignOut} />;
    }
  }
}

export default SidebarSingleton;

