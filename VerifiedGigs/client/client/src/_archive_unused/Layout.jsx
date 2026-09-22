import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

/**
 * Layout component that renders the common navigation elements (Navbar and Sidebar)
 * and the outlet for nested routes. The Sidebar is shown only for authenticated
 * users (the AuthProvider guarantees that the layout is rendered inside a
 * ProtectedRoute). It is responsive – on small screens it collapses into a
 * hamburger menu handled inside Navbar.
 */
const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

