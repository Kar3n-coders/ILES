import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Sidebar.css";

const NAV_CONFIG = {
  student: {
    accentColor: "#1a365d",
    accentLight: "#ebf4ff",
    brandLabel: "Student Portal",
    sections: [
      {
        title: null,
        items: [
          {
            path: "/student/dashboard",
            label: "Overview",
            icon: <HomeIcon />,
            description: "Your internship at a glance",
          },
          {
            path: "/student/logbook",
            label: "Daily Logs",
            icon: <LogbookIcon />,
            description: "Weekly activity logs",
          },
          {
            path: "/student/evaluations",
            label: "Evaluations",
            icon: <StarIcon />,
            description: "Scores from supervisors",
          },
        ],
      },
      {
        title: "Resources",
        items: [
          {
            path: "/student/profile",
            label: "My Profile",
            icon: <ProfileIcon />,
            description: "Personal information",
          },
        ],
      },
    ],
  },

  workplace_supervisor: {
    accentColor: "#276749",
    accentLight: "#f0fff4",
    brandLabel: "Workplace Supervisor",
    sections: [
      {
        title: null,
        items: [
          {
            path: "/supervisor/dashboard",
            label: "Dashboard",
            icon: <HomeIcon />,
            description: "Review queue overview",
          },
          {
            path: "/supervisor/students",
            label: "My Students",
            icon: <UsersIcon />,
            description: "Assigned interns",
          },
          {
            path: "/supervisor/logs",
            label: "Logs",
            icon: <LogbookIcon />,
            description: "Review student logbooks",
          },
          {
            path: "/supervisor/evaluation",
            label: "Evaluations",
            icon: <StarIcon />,
            description: "Score & grade students",
          },
          {
            path: "/supervisor/profile",
            label: "My Profile",
            icon: <ProfileIcon />,
            description: "Your information",
          },
        ],
      },
    ],
  },

  academic_supervisor: {
    accentColor: "#c05621",
    accentLight: "#fff7ed",
    brandLabel: "Academic Supervisor",
    sections: [
      {
        title: null,
        items: [
          {
            path: "/academic/dashboard",
            label: "Dashboard",
            icon: <HomeIcon />,
            description: "Evaluation overview",
          },
          {
            path: "/academic/criteria",
            label: "Criteria",
            icon: <StarIcon />,
            description: "Manage evaluation criteria",
          },
          {
            path: "/academic/evaluation",
            label: "Grades",
            icon: <LogbookIcon />,
            description: "Student evaluation scores",
          },
          {
            path: "/academic/students",
            label: "Students",
            icon: <UsersIcon />,
            description: "Assigned students",
          },
          {
            path: "/academic/profile",
            label: "My Profile",
            icon: <ProfileIcon />,
            description: "Your information",
          },
        ],
      },
    ],
  },

  internship_admin: {
    accentColor: "#6b46c1",
    accentLight: "#faf5ff",
    brandLabel: "Administration",
    sections: [
      {
        title: null,
        items: [
          {
            path: "/admin/dashboard",
            label: "Dashboard",
            icon: <HomeIcon />,
            description: "System overview",
          },
          {
            path: "/admin/placements",
            label: "Placements",
            icon: <BuildingIcon />,
            description: "Company placements",
          },
          {
            path: "/admin/users",
            label: "Users",
            icon: <UsersIcon />,
            description: "Manage all accounts",
          },
          {
            path: "/admin/criteria",
            label: "Criteria",
            icon: <ClipboardIcon />,
            description: "Evaluation criteria (read-only)",
          },
          {
            path: "/admin/profile",
            label: "My Profile",
            icon: <ProfileIcon />,
            description: "Your information",
          },
        ],
      },
    ],
  },
};

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);

  const config = user ? (NAV_CONFIG[user.role] ?? NAV_CONFIG.student) : null;

  if (!config) return null;

  const { accentColor, accentLight, brandLabel, sections } = config;

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
      user.username?.slice(0, 2).toUpperCase()
    : "??";

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
    : (user?.username ?? "");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside
      className={`iles-sidebar ${collapsed ? "iles-sidebar--collapsed" : ""}`}
      aria-label="Main navigation"
      style={{
        "--sidebar-accent": accentColor,
        "--sidebar-accent-light": accentLight,
      }}
    >
      <div className="iles-sidebar__header">
        <div
          className="iles-sidebar__brand"
          style={{ background: accentColor }}
        >
          <div className="iles-sidebar__brand-logo">
            <span className="iles-sidebar__brand-il">IL</span>
            <span className="iles-sidebar__brand-es">ES</span>
          </div>
          {!collapsed && (
            <div className="iles-sidebar__brand-meta">
              <span className="iles-sidebar__brand-name">ILES</span>
              <span className="iles-sidebar__brand-label">{brandLabel}</span>
            </div>
          )}
        </div>
        <button
          className="iles-sidebar__collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          <CollapseIcon flipped={collapsed} />
        </button>
      </div>

      <div className="iles-sidebar__user-card">
        <div
          className="iles-sidebar__user-avatar"
          style={{ background: accentColor }}
          aria-hidden="true"
        >
          {initials}
        </div>
        {!collapsed && (
          <div className="iles-sidebar__user-info">
            <p className="iles-sidebar__user-name" title={displayName}>
              {displayName}
            </p>
            <p className="iles-sidebar__user-role">
              {user?.role?.replace(/_/g, " ")}
            </p>
          </div>
        )}
        {!collapsed && (
          <div
            className="iles-sidebar__user-status"
            title="Online"
            aria-label="Status: online"
          />
        )}
      </div>

      <nav className="iles-sidebar__nav" aria-label="Sidebar navigation">
        {sections.map((section, si) => (
          <div key={si} className="iles-sidebar__section">
            {section.title && !collapsed && (
              <p className="iles-sidebar__section-title">{section.title}</p>
            )}
            <ul className="iles-sidebar__menu">
              {section.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive: navActive }) =>
                        `iles-sidebar__link ${navActive ? "iles-sidebar__link--active" : ""}`
                      }
                      onMouseEnter={() => setHoveredPath(item.path)}
                      onMouseLeave={() => setHoveredPath(null)}
                      title={collapsed ? item.label : undefined}
                      aria-label={item.label}
                    >
                      {isActive && (
                        <span
                          className="iles-sidebar__link-bar"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className="iles-sidebar__link-icon"
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="iles-sidebar__link-content">
                          <span className="iles-sidebar__link-label">
                            {item.label}
                          </span>
                          {hoveredPath === item.path && !isActive && (
                            <span className="iles-sidebar__link-desc">
                              {item.description}
                            </span>
                          )}
                        </span>
                      )}
                      {collapsed && (
                        <span className="iles-sidebar__tooltip" role="tooltip">
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="iles-sidebar__footer">
        <button
          className="iles-sidebar__logout-btn"
          onClick={handleLogout}
          type="button"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogoutIcon />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LogbookIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function CollapseIcon({ flipped }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: flipped ? "rotate(180deg)" : "none",
        transition: "transform 0.25s ease",
      }}
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export default Sidebar;
