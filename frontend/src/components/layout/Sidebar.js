import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import './Sidebar.css';

const NAV_CONFIG = {
    student: {
        accentColor: "#1a365d",
        accentLight: "#ebf4ff",
        brandLabel: "Student Portal",
        sections: [
            {
                title: null,
                items: [
                    { path: "/student/dashboard", label: "Overview", icon: <HomeIcon />,   description: "Your internship at a glance" },
                    { path: "student/logbook", label: "Daily Logs", icon: <LogbookIcon />, description: "Weekly activity logs" },
                    { path: "student/progress", label: "Progress", icon: <ProgressIcon />, description: "Hours & completion rate" },
                ],
            },
            {
                title: "Resources",
                items: [
                    { path: "/student/schedule", label: "Schedule", icon: <CalendarIcon />, description: "Week-by-week timeline" },
                    { path: "/student/documents", label: "Documents", icon: <DocsIcon />, description: "Upload & manage files" },
                    { path: "/student/profile", label: "My Profile", icon: <ProfileIcon />, description: "Personal information" },
                ],
            },
        ],
    },
    
}


function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LogbookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

const NAV_CONFIG = {
  student: [
    { label: 'Overview', path: '/student/dashboard', icon: '🏠' },
    { label: 'Daily Logs', path: '/student/logbook', icon: '📖' },
    { label: 'Progress', path: '/student/progress', icon: '📈' },
    { label: 'Schedule', path: '/student/schedule', icon: '📅' },
    { label: 'Documents', path: '/student/documents', icon: '📄' },
    { label: 'My Profile', path: '/student/profile', icon: '👤' },
  
  ],

  workplace_supervisor: [
    { label: 'Dashboard', path: '/supervisor/dashboard', icon: '🏠' },
    { label: 'My Students', path: '/supervisor/students', icon: '👥' },
    { label: 'Evaluations', path: '/supervisor/evaluation', icon: '⭐' },
    { label: 'My Profile', path: '/supervisor/profile', icon: '👤' },

  ],

  academic_supervisor: [
    { label: 'Dashboard', path: '/academic/dashboard', icon: '🏠' },
    { label: 'Evaluations', path: '/academic/evaluation', icon: '⭐' },
    { label: 'Students', path: '/academic/students', icon: '👥' },
    
  ],

  internship_admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '🏠' },
    { label: 'Placements', path: '/admin/placements', icon: '🏢' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Criteria', path: '/admin/criteria', icon: '📋' },
  ],
};

function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = NAV_CONFIG[user?.role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.username?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="sidebar-name">{user?.username}</p>
          <p className="sidebar-role">{user?.role}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
          key={item.path}
          to={item.path}
          className={({isActive}) =>
            `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
        }
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        🚪 Sign Out
      </button>
    </aside>
  );
}

export default Sidebar.js;