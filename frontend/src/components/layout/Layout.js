import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <Navbar />

      <div className="layout__body">
        <div className="sidebar-section">
          <Sidebar />
        </div>

        <div className="main-layout">
          <main className="layout__main" id="main-content" role="main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
