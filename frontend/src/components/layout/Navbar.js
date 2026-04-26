import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

const ROLE_NAV_LINKS = {
  student: [
    { path: "/student/dashboard", label: "Dashboard" },
    { path: "/student/logbook", label: "My Logbook" },
  ],
  workplace_supervisor: [
    { path: "/supervisor/dashboard", label: "Dashboard" },
    { path: "supervisor/evaluation", label: "Evaluations" },
  ],
  academic_supervisor: [
    { path: "/supervisor/dashboard", label: "Dashboard" },
    { path: "/supervisor/evaluation", label: "Evaluations" },
  ],
  internship_admin: [{ path: "/admin", label: "Admin Dashboard" }],
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navlinks = ROLE_NAV_LINKS[user?.role] ?? [];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Get current active label for the breadcrumb-style title
  const activeLabel =
    navlinks.find((l) => window.location.pathname.includes(l.path))?.label ||
    "ILES";

  return (
    <header className="navbar" role="banner">
      <div className="navbar-left">
        <h1 className="navbar-Title">{activeLabel}</h1>
        <p className="navbar-subtitle">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <a href="#main-content" className="visually-hidden">
        Skip to main content
      </a>

      {user && (
        <div className="navbar-right">
          {/* Navigation Links are rendered as ghost buttons to match UI style*/}
          <nav className="navbar-nav-links" aria-label="Main navigation">
            {navlinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="btn btn-ghost btn-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="navbar-user-group">
            <span className={`badge badge-role-${user.role.split("_")[0]}`}>
              {user.role.replace("_", " ")}
            </span>

            <div className="navbar-avatar">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </div>

            <button
              className="btn btn-danger btn-sm"
              onClick={handleLogout}
              type="button"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
