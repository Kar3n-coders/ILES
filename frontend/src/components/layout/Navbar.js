import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

// TODO: ILES-21: Add ROLE_NAV_LINK and ROLE_CONFIG constanst here
const ROLE_NAV_LINKS = {
  student: [
    { path: "/student/dashboard", label: "Overview", icon: "⌂" },
    { path: "/student/logbook", label: "My Logbook", icon: "✎" },
    { path: "/student/progress", label: "Progress", icon: "↗" },
  ],
  workplace_supervisor: [
    { path: "/supervisor/dashboard", label: "Dashboard", icon: "⌂" },
    { path: "/supervisor/evaluation", label: "Evaluations", icon: "★" },
  ],
  academic_supervisor: [
    { path: "/supervisor/dashboard", label: "Dashboard", icon: "⌂" },
    { path: "/supervisor/evaluation", label: "Evaluations", icon: "★" },
  ],
  internship_admin: [{ path: "/admin", label: "Admin Dashboard", icon: "⌂" }],
};

const ROLE_CONFIG = {
  student: {
    label: "Student",
    color: "#1a365d",
    accent: "#2b6cb0",
    badge: "STU",
  },
  workplace_supervisor: {
    label: "Supervisor",
    color: "#276749",
    accent: "#38a169",
    badge: "SUP",
  },
  academic_supervisor: {
    label: "Academic Sup.",
    color: "#c05621",
    accent: "#dd6b20",
    badge: "ACS",
  },
  internship_admin: {
    label: "Admin",
    color: "#6b46c1",
    accent: "#805ad5",
    badge: "ADM",
  },
};

// TODO: ILES-23: Add nav links JSX
// TODO: ILES-24: Add user controls and dropdown JSX

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const menuRef = useRef(null);

  const roleConfig = user
    ? (ROLE_CONFIG[user.role] ?? ROLE_CONFIG.student)
    : null;
  const navLinks = user ? (ROLE_NAV_LINKS[user.role] ?? []) : [];

  /* Live clock — updates every 60 seconds */
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id); // cleanup when component unmounts
  }, []);

  /* Shrink navbar on scroll — adds CSS class when page is scrolled */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown when user clicks anywhere outside the menu */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/login");
  }

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
      user.username?.slice(0, 2).toUpperCase()
    : "??";

  return (
    <header
      className={`iles-navbar ${scrolled ? "iles-navbar--scrolled" : ""}`}
      role="banner"
    >
      {/* Skip link for keyboard / screen-reader accessibility */}
      <a href="#main-content" className="iles-navbar__skip">
        Skip to main content
      </a>

      {/* LEFT: Brand logo + date/time */}
      <div className="iles-navbar__brand">
        <Link to="/" className="iles-navbar__logo" aria-label="ILES Home">
          <span className="iles-navbar__logo-mark">IL</span>
          <span className="iles-navbar__logo-text">ES</span>
        </Link>
        <div className="iles-navbar__divider" aria-hidden="true" />
        <div className="iles-navbar__meta">
          <span className="iles-navbar__date">{formattedDate}</span>
          <span className="iles-navbar__time">{formattedTime}</span>
        </div>
      </div>

      {/* CENTRE: Nav links — only render if user is logged in */}
      {user && navLinks.length > 0 && (
        <nav className="iles-navbar__nav" aria-label="Primary navigation">
          {navLinks.map((link) => {
            // Check if this link matches the current URL path
            const isActive =
              location.pathname === link.path ||
              location.pathname.startsWith(link.path + "/");

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`iles-navbar__link ${isActive ? "iles-navbar__link--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Icon character */}
                <span className="iles-navbar__link-icon" aria-hidden="true">
                  {link.icon}
                </span>

                {/* Link text */}
                <span className="iles-navbar__link-label">{link.label}</span>

                {/* Animated underline pip shown only on active link */}
                {isActive && (
                  <span className="iles-navbar__link-pip" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>
      )}
      {/* RIGHT: User controls — only render if logged in */}
      {user && (
        <div className="iles-navbar__controls">
          {/* Role badge — colour comes from CSS custom property */}
          <span
            className="iles-navbar__role-badge"
            style={{ "--role-color": roleConfig?.color }}
            title={roleConfig?.label}
          >
            {roleConfig?.badge}
          </span>

          {/* Notification bell button */}
          <button
            className="iles-navbar__icon-btn"
            aria-label="Notifications"
            type="button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="iles-navbar__notif-dot" aria-hidden="true" />
          </button>

          {/* Avatar button + dropdown — ref attached so outside clicks close it */}
          <div className="iles-navbar__user-menu" ref={menuRef}>
            <button
              className={`iles-navbar__avatar-btn ${menuOpen ? "iles-navbar__avatar-btn--open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label={`User menu for ${user.first_name ?? user.username}`}
              type="button"
              style={{ "--role-color": roleConfig?.color }}
            >
              <span className="iles-navbar__avatar" aria-hidden="true">
                {initials}
              </span>
              <span className="iles-navbar__user-info">
                <span className="iles-navbar__user-name">
                  {user.first_name
                    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                    : user.username}
                </span>
                <span className="iles-navbar__user-role">
                  {roleConfig?.label}
                </span>
              </span>
              <svg
                className={`iles-navbar__chevron ${menuOpen ? "iles-navbar__chevron--up" : ""}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown — only renders when menuOpen is true */}
            {menuOpen && (
              <div
                className="iles-navbar__dropdown"
                role="menu"
                aria-label="User menu"
              >
                {/* Header: avatar + name + email */}
                <div className="iles-navbar__dropdown-header">
                  <span
                    className="iles-navbar__dropdown-avatar"
                    style={{ "--role-color": roleConfig?.color }}
                  >
                    {initials}
                  </span>
                  <div>
                    <p className="iles-navbar__dropdown-name">
                      {user.first_name
                        ? `${user.first_name} ${user.last_name ?? ""}`.trim()
                        : user.username}
                    </p>
                    <p className="iles-navbar__dropdown-email">
                      {user.email ?? user.username}
                    </p>
                  </div>
                </div>

                {/* Links section */}
                <div className="iles-navbar__dropdown-section">
                  <Link
                    to="/profile"
                    className="iles-navbar__dropdown-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="iles-navbar__dropdown-item"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                  </Link>
                </div>

                {/* Sign out section */}
                <div className="iles-navbar__dropdown-section">
                  <button
                    className="iles-navbar__dropdown-item iles-navbar__dropdown-item--danger"
                    role="menuitem"
                    onClick={handleLogout}
                    type="button"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}

export default Navbar;
